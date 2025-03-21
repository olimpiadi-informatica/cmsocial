import type { Task } from "~/lib/api/task";

export function HelpIt({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Come funziona l'input e l'output</h2>
      {io === "grader" && (
        <>
          <p>
            Questo problema utilizza i grader. Dovrai implementare una funzione in grado di
            risolvere il problema; il grader chiamata la tua funzione, gestendo in automatico la
            lettura degli input e la scrittura degli output.
          </p>
          <p>
            Per ulteriori dettagli, consulta la{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">guida dedicata ai grader</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Questo è un problema di tipo <i>output-only</i>. Troverai tutti gli input tra gli allegati
          del problema e dovrai generare, per ciascuno, il corrispondente output da inviare. Non è
          necessario inviare il codice sorgente: puoi risolvere il problema utilizzando qualsiasi
          linguaggio, senza limiti di tempo o memoria.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Il tuo programma dovrà leggere i dati di input da <code>stdin</code> e scrivere gli output
          su <code>stdout</code>.
          {taskType === "Communication" &&
            " Assicurati di eseguire il flush dell'output dopo ogni operazione."}
        </p>
      )}
      {io === "input.txt / output.txt" && (
        <p>
          Il tuo programma dovrà leggere i dati di input dal file <code>input.txt</code> e scrivere
          gli output nel file <code>output.txt</code>.
        </p>
      )}
      <p>
        Assicurati che nel tuo codice non siano presenti messaggi di debug o output superflui, in
        quanto potrebbero compromettere la corretta valutazione della soluzione. Ad esempio,
        messaggi come &laquo;<i>Inserisci il numero N</i>&raquo; non sono necessari.
      </p>
      <p>
        {io !== "grader" &&
          "Nel testo trovi la descrizione dettagliata del formato di input e output, assicurati di rispettarlo esattamente. "}
        Spesso, tra gli allegati, viene anche fornito un template che implementa esclusivamente la
        gestione dell'input/output, da cui puoi partire.
      </p>
    </div>
  );
}
