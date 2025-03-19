import { getTask } from "~/lib/api/task";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function Page({ params }: Props) {
  await loadLocale();
  const { name } = await params;

  const task = await getTask(name);
  if (!task) return;

  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Come funziona l'input e l'output</h2>
      {task.io === "grader" && (
        <>
          <p>
            Questo problema usa i grader. Dovrai implementare una funzione che risolve il problema,
            questa funzione verrà chiamata dal grader. Non devi preoccuparti della parte di
            input/output, il grader si occuperà, al posto tuo, di leggere i dati di input e scrivere
            i dati in output.
          </p>
          <p>
            Per ulteriori dettagli, puoi consultare la{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">guida sui grader</a>.
          </p>
        </>
      )}
      {task.io === "output-only" && (
        <p>
          Questo è un problema di tipo <i>output-only</i>. Troverai tutti gli input tra gli allegati
          del problema, per ciascuno dovrai produrre un output e inviarlo. Non è richiesto di
          inviare il codice sorgente, puoi risolvere il problema con qualsiasi linguaggio e non sono
          presenti limiti di tempo o memoria.
        </p>
      )}
      {task.io === "stdin / stdout" && (
        <p>
          Il tuo programma dovrà leggere i dati di input da <code>stdin</code> e scrivere i dati di
          output su <code>stdout</code>.
          {task.taskType === "Communication" &&
            " Assicurati di fare il flush dell'output dopo ogni interazione."}
        </p>
      )}
      {task.io === "input.txt / output.txt" && (
        <p>
          Il tuo programma dovrà leggere i dati di input dal file <code>input.txt</code> e scrivere
          i dati di output nel file <code>output.txt</code>.
        </p>
      )}
      <p>
        Assicurati che nel tuo codice non ci siano messaggi di debug o output aggiuntivi, altrimenti
        il tuo programma potrebbe non essere valutato correttamente. Ad esempio, output come &laquo;
        <i>Inserisci il numero N</i>&raquo; non sono necessari.
      </p>
      <p>
        {task.io !== "grader" &&
          "Nel testo trovi la descrizione precisa del formato di input e output, assicurati di rispettarlo esattamente. "}
        Spesso, tra gli allegati è presente un template di esempio, da cui puoi partire, che
        implementa solo la parte di input/output.
      </p>
    </div>
  );
}
