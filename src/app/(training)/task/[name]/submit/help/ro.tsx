import type { Task } from "~/lib/api/task";

export function HelpRo({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Cum funcționează input-ul și output-ul</h2>
      {io === "grader" && (
        <>
          <p>
            Această problemă folosește gradere. Va trebui să implementezi o funcție capabilă să
            rezolve problema; graderul va apela funcția ta, gestionând automat citirea input-ului și
            scrierea output-ului.
          </p>
          <p>
            Pentru mai multe detalii, consultă{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">ghidul dedicat graderelor</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Aceasta este o problemă de tip <i>output-only</i>. Vei găsi toate fișierele de input în
          atașamentele problemei și va trebui să generezi pentru fiecare output-ul corespunzător de
          trimis. Nu este necesar să trimiți codul sursă: poți rezolva problema în orice limbaj,
          fără limită de timp sau memorie.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Programul tău va trebui să citească datele de input din <code>stdin</code> și să scrie
          output-ul în <code>stdout</code>.
          {taskType === "Communication" &&
            " Asigură-te că faci flush la output după fiecare operație."}
        </p>
      )}
      {io === "file" && (
        <p>
          Programul tău va trebui să citească datele de input din fișierul <code>input.txt</code> și
          să scrie output-ul în fișierul <code>output.txt</code>.
        </p>
      )}
      <p>
        Asigură-te că în codul tău nu există mesaje de debug sau output inutil, deoarece acestea ar
        putea compromite evaluarea corectă a soluției. De exemplu, mesaje precum &laquo;
        <i>Introduceți numărul N</i>&raquo; nu sunt necesare.
      </p>
      <p>
        {io !== "grader" &&
          "Enunțul conține o descriere detaliată a formatului de input și output; asigură-te că îl respecți exact. "}
        Adesea, printre atașamente, este furnizat și un template care implementează doar gestionarea
        input/output-ului și care poate fi un punct de plecare.
      </p>
    </div>
  );
}
