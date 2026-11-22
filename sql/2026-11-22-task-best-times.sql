-- Classifica delle soluzioni più veloci (stile https://myk00l.github.io/cmranking/).
--
-- Crea la tabella `task_best_times`, che per ogni task contiene il tempo migliore
-- tra le soluzioni da 100 punti (escludendo le partecipazioni nascoste), l'utente che
-- lo detiene e il numero di utenti che hanno ottenuto esattamente quel tempo.
-- Un task con `tied_count = 1` ha un record unico, altrimenti è un pari merito.
--
-- La tabella è tenuta aggiornata da trigger su `taskscores` e `participations`.
-- Nessuna tabella esistente viene modificata (vengono solo aggiunti trigger).
-- Le cancellazioni di task/partecipazioni/utenti sono gestite dal trigger su
-- `taskscores`, grazie alle FK con ON DELETE CASCADE di `taskscores`.
--
-- Lo script è idempotente: può essere rieseguito senza problemi, e ricalcola tutto.

BEGIN;

CREATE TABLE IF NOT EXISTS public.task_best_times (
  task_id integer PRIMARY KEY
    CONSTRAINT task_best_times_task_id_fkey REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  -- uno degli utenti col tempo migliore (quello con id minore in caso di pari merito)
  user_id integer NOT NULL
    CONSTRAINT task_best_times_user_id_fkey REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "time" double precision NOT NULL,
  -- numero di utenti che hanno ottenuto il tempo migliore
  tied_count integer NOT NULL
);

CREATE INDEX IF NOT EXISTS task_best_times_user_id_idx ON public.task_best_times USING btree (user_id);

ALTER TABLE public.task_best_times OWNER TO training;


-- Ricalcola il record di un singolo task.
CREATE OR REPLACE FUNCTION public.refresh_task_best_time(p_task_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_user_id integer;
  v_time double precision;
  v_tied integer;
BEGIN
  -- Serializza gli aggiornamenti dello stesso task: senza questo lock due transazioni
  -- concorrenti potrebbero non vedere l'una le modifiche dell'altra e scrivere un
  -- risultato obsoleto. Dopo aver preso il lock la query successiva usa un nuovo
  -- snapshot (READ COMMITTED), quindi vede le transazioni già committate.
  PERFORM pg_advisory_xact_lock(1952805748, p_task_id);

  WITH per_user AS (
    SELECT p.user_id, MIN(ts.time) AS best
    FROM public.taskscores ts
    JOIN public.participations p ON p.id = ts.participation_id
    WHERE ts.task_id = p_task_id AND ts.score >= 100 AND NOT p.hidden
    GROUP BY p.user_id
  )
  SELECT user_id, best, COUNT(*) OVER (PARTITION BY best)
  INTO v_user_id, v_time, v_tied
  FROM per_user
  ORDER BY best, user_id
  LIMIT 1;

  IF NOT FOUND THEN
    DELETE FROM public.task_best_times WHERE task_id = p_task_id;
  ELSE
    INSERT INTO public.task_best_times (task_id, user_id, time, tied_count)
    VALUES (p_task_id, v_user_id, v_time, v_tied)
    ON CONFLICT (task_id) DO UPDATE
      SET user_id = EXCLUDED.user_id, time = EXCLUDED.time, tied_count = EXCLUDED.tied_count
      WHERE (task_best_times.user_id, task_best_times.time, task_best_times.tied_count)
        IS DISTINCT FROM (EXCLUDED.user_id, EXCLUDED.time, EXCLUDED.tied_count);
  END IF;
END;
$$;

ALTER FUNCTION public.refresh_task_best_time(integer) OWNER TO training;


-- Trigger su taskscores: ricalcola solo se è coinvolta una soluzione da 100 punti.
CREATE OR REPLACE FUNCTION public.on_taskscore_change_best_time() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.score >= 100 THEN
      PERFORM public.refresh_task_best_time(NEW.task_id);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.score >= 100 THEN
      PERFORM public.refresh_task_best_time(OLD.task_id);
    END IF;
  ELSE
    IF (OLD.score >= 100 OR NEW.score >= 100)
       AND (OLD.score, OLD.time, OLD.task_id, OLD.participation_id)
         IS DISTINCT FROM (NEW.score, NEW.time, NEW.task_id, NEW.participation_id) THEN
      IF OLD.task_id <> NEW.task_id THEN
        PERFORM public.refresh_task_best_time(LEAST(OLD.task_id, NEW.task_id));
        PERFORM public.refresh_task_best_time(GREATEST(OLD.task_id, NEW.task_id));
      ELSE
        PERFORM public.refresh_task_best_time(NEW.task_id);
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

ALTER FUNCTION public.on_taskscore_change_best_time() OWNER TO training;

DROP TRIGGER IF EXISTS taskscore_best_time ON public.taskscores;
CREATE TRIGGER taskscore_best_time AFTER INSERT OR DELETE OR UPDATE ON public.taskscores FOR EACH ROW EXECUTE FUNCTION public.on_taskscore_change_best_time();


-- Trigger su participations: quando una partecipazione viene nascosta/mostrata o
-- spostata su un altro utente, ricalcola i task che aveva risolto.
CREATE OR REPLACE FUNCTION public.on_participation_change_best_time() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  t integer;
BEGIN
  FOR t IN
    SELECT DISTINCT task_id FROM public.taskscores
    WHERE participation_id = NEW.id AND score >= 100
    ORDER BY task_id
  LOOP
    PERFORM public.refresh_task_best_time(t);
  END LOOP;
  RETURN NULL;
END;
$$;

ALTER FUNCTION public.on_participation_change_best_time() OWNER TO training;

DROP TRIGGER IF EXISTS participation_best_time ON public.participations;
CREATE TRIGGER participation_best_time AFTER UPDATE OF hidden, user_id ON public.participations FOR EACH ROW WHEN (((old.hidden IS DISTINCT FROM new.hidden) OR (old.user_id IS DISTINCT FROM new.user_id))) EXECUTE FUNCTION public.on_participation_change_best_time();


-- Popolamento iniziale (e ricalcolo completo se lo script viene rieseguito).
SELECT public.refresh_task_best_time(id) FROM public.tasks ORDER BY id;

COMMIT;
