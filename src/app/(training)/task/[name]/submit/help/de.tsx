import type { Task } from "~/lib/api/task";

export function HelpDe({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Wie Input und Output funktionieren</h2>
      {io === "grader" && (
        <>
          <p>
            Dieses Problem verwendet Grader. Sie müssen eine Funktion implementieren, die das
            Problem lösen kann; der Grader ruft Ihre Funktion auf und übernimmt automatisch das
            Lesen der Eingaben und das Schreiben der Ausgaben.
          </p>
          <p>
            Weitere Details finden Sie im{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">speziellen Leitfaden zu Gradern</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Dies ist ein <i>Output-Only</i>-Problem. Sie finden alle Eingaben in den Anhängen des
          Problems und müssen für jede die entsprechende Ausgabe generieren, die Sie einreichen
          können. Es ist nicht notwendig, den Quellcode einzureichen: Sie können das Problem mit
          jeder beliebigen Sprache lösen, ohne Zeit- oder Speicherbeschränkungen.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Ihr Programm muss Eingabedaten von <code>stdin</code> lesen und Ausgaben nach{" "}
          <code>stdout</code> schreiben.
          {taskType === "Communication" &&
            " Stellen Sie sicher, dass Sie die Ausgabe nach jeder Operation leeren."}
        </p>
      )}
      {io === "file" && (
        <p>
          Ihr Programm muss Eingabedaten aus der Datei <code>input.txt</code> lesen und Ausgaben in
          die Datei <code>output.txt</code> schreiben.
        </p>
      )}
      <p>
        Stellen Sie sicher, dass Ihr Code keine Debug-Meldungen oder unnötige Ausgaben enthält, da
        diese die korrekte Bewertung der Lösung beeinträchtigen könnten. Zum Beispiel sind
        Nachrichten wie &laquo;
        <i>Geben Sie die Zahl N ein</i>&raquo; nicht erforderlich.
      </p>
      <p>
        {io !== "grader" &&
          "In der Problemstellung finden Sie eine detaillierte Beschreibung des Eingabe- und Ausgabeformats; stellen Sie sicher, dass Sie diese genau befolgen. "}
        Oft wird auch eine Vorlage unter den Anhängen bereitgestellt, die nur die Eingabe-
        /Ausgabebehandlung implementiert und als Ausgangspunkt dienen kann.
      </p>
    </div>
  );
}
