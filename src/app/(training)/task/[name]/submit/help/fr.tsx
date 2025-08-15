import type { Task } from "~/lib/api/task";

export function HelpFr({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Comment fonctionnent l'entrée et la sortie</h2>
      {io === "grader" && (
        <>
          <p>
            Ce problème utilise des graders. Vous devrez implémenter une fonction capable de
            résoudre le problème; le grader appellera votre fonction, gérant automatiquement la
            lecture des entrées et l'écriture des sorties.
          </p>
          <p>
            Pour plus de détails, consultez le{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">guide dédié aux graders</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Ceci est un problème de type <i>sortie-seulement</i> (output-only). Vous trouverez toutes
          les entrées parmi les pièces jointes du problème et vous devrez générer, pour chacune, la
          sortie correspondante à soumettre. Il n'est pas nécessaire de soumettre le code source:
          vous pouvez résoudre le problème en utilisant n'importe quel langage, sans limites de
          temps ou de mémoire.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          Votre programme devra lire les données d'entrée depuis <code>stdin</code> et écrire les
          sorties sur <code>stdout</code>.
          {taskType === "Communication" &&
            " Assurez-vous de vider (flush) la sortie après chaque opération."}
        </p>
      )}
      {io === "file" && (
        <p>
          Votre programme devra lire les données d'entrée depuis le fichier <code>input.txt</code>{" "}
          et écrire les sorties dans le fichier <code>output.txt</code>.
        </p>
      )}
      <p>
        Assurez-vous que votre code ne contient pas de messages de débogage ou de sorties
        superflues, car ils pourraient compromettre la bonne évaluation de la solution. Par exemple,
        les messages comme &laquo;<i>Entrez le nombre N</i>&raquo; ne sont pas nécessaires.
      </p>
      <p>
        {io !== "grader" &&
          "Le texte du problème contient une description détaillée du format d'entrée et de sortie; assurez-vous de le respecter exactement. "}
        Souvent, un modèle est également fourni parmi les pièces jointes, qui implémente
        exclusivement la gestion de l'entrée/sortie et peut servir de point de départ.
      </p>
    </div>
  );
}
