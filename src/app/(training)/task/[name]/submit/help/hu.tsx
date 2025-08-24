import type { Task } from "~/lib/api/task";

export function HelpHu({ io, taskType }: { io: Task["io"]; taskType: Task["taskType"] }) {
  return (
    <div className="prose max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400">
      <h2>Hogyan működik a bemenet és a kimenet</h2>
      {io === "grader" && (
        <>
          <p>
            Ez a feladat gradereket használ. Olyan függvényt kell megvalósítanod, amely képes
            megoldani a feladatot; a grader meghívja a függvényedet, automatikusan kezelve a bemenet
            beolvasását és a kimenet kiírását.
          </p>
          <p>
            További részletekért lásd a{" "}
            <a href="https://wiki.olinfo.it/Guide/grader">grader-ekről szóló útmutatót</a>.
          </p>
        </>
      )}
      {io === "output-only" && (
        <p>
          Ez egy <i>output-only</i> típusú feladat. Az összes bemenetet megtalálod a feladat
          mellékletei között, és mindegyikhez elő kell állítanod a megfelelő kimenetet, amelyet be
          kell nyújtanod. Nem szükséges a forráskódot beküldeni: bármilyen nyelven megoldhatod, idő-
          és memória-korlátozás nélkül.
        </p>
      )}
      {io === "stdin / stdout" && (
        <p>
          A programodnak a bemenetet a <code>stdin</code>-ből kell olvasnia, és a kimenetet a{" "}
          <code>stdout</code>-ra kell írnia.
          {taskType === "Communication" &&
            " Ügyelj arra, hogy minden művelet után flush-eld a kimenetet."}
        </p>
      )}
      {io === "file" && (
        <p>
          A programodnak a bemenetet az <code>input.txt</code> fájlból kell olvasnia, és a kimenetet
          az <code>output.txt</code> fájlba kell írnia.
        </p>
      )}
      <p>
        Ügyelj arra, hogy a kódodban ne legyenek debug üzenetek vagy felesleges kimenetek, mert ezek
        akadályozhatják a megoldás helyes kiértékelését. Például az olyan üzenetek, mint &laquo;
        <i>Írd be az N számot</i>&raquo;, nem szükségesek.
      </p>
      <p>
        {io !== "grader" &&
          "A feladat szövege részletesen leírja a bemenet és a kimenet formátumát; ügyelj arra, hogy pontosan kövesd. "}
        Gyakran mellékletként sablon is található, amely csak a bemenet/kimenet kezelését valósítja
        meg, és kiindulópontként szolgálhat.
      </p>
    </div>
  );
}
