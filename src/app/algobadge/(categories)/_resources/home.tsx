import clsx from "clsx";
import { BookmarkCheck, Gem, Medal, TriangleAlert } from "lucide-react";

import { Badge, badgeColor, algobadge } from "~/lib/algobadge";

export function Home({ totalBadge }: { totalBadge: Badge }) {
  const honorable = Object.entries(algobadge)
    .filter(([, category]) => category.hasHonorable)
    .map(([id]) => (
      <span key={id} className="group">
        <span className="group-first:hidden group-last:hidden">, </span>
        <span className="hidden group-last:inline"> e </span>
        <b>{id}</b>
      </span>
    ));

  return (
    <>
      <h1>Benvenuto/a in AlgoBadge!</h1>
      <p>
        AlgoBadge è un percorso di allenamento che ti consentirà di apprendere gli algoritmi e le
        tecniche essenziali per affrontare le fase Nazione delle Olimpiadi di Informatica.
      </p>
      <p>
        Il percorso è composto da otto categorie, ciascuna con un task in formato territoriali da 50
        punti e due task in formato nazionali da 100 punti. Puoi provare quante volte vuoi a
        risolvere ciascun task.
      </p>
      <ul>
        <li>
          con <b>50</b> punti ottieni la menzione d'onore{" "}
          <BookmarkCheck className={badgeColor[Badge.Honorable]} /> e sblocchi le categorie
          successive
        </li>
        <li>
          con <b>100</b> punti ottieni il badge di bronzo{" "}
          <Medal className={clsx(badgeColor[Badge.Bronze], "last:*:hidden")} />
        </li>
        <li>
          con <b>150</b> punti ottieni il badge d'argento{" "}
          <Medal className={clsx(badgeColor[Badge.Silver], "last:*:hidden")} />
        </li>
        <li>
          con <b>200</b> punti ottieni il badge d'oro{" "}
          <Medal className={clsx(badgeColor[Badge.Gold], "last:*:hidden")} />
        </li>
        <li>
          con <b>250</b> punti ottieni il badge di diamante{" "}
          <Gem className={badgeColor[Badge.Diamond]} />
        </li>
      </ul>
      <p>
        {totalBadge >= Badge.Honorable ? (
          <>
            Hai ottenuto la menzione d'onore!{" "}
            <BookmarkCheck className={badgeColor[Badge.Honorable]} /> Sei ammissibile alla Fase
            Territoriale delle Olimpiadi di Informatica.
          </>
        ) : (
          <>
            Ottenendo la menzione d'onore <BookmarkCheck className={badgeColor[Badge.Honorable]} />{" "}
            in <span>{honorable}</span> sarai ammissibile alla Fase Territoriale delle Olimpiadi di
            Informatica.
          </>
        )}
        <br />
        {totalBadge >= Badge.Bronze ? (
          <>
            Hai ottenuto il badge di bronzo!{" "}
            <Medal className={clsx(badgeColor[Badge.Bronze], "last:*:hidden")} /> Sei ammissibile
            alla Finale Nazionale delle Olimpiadi di Informatica.
          </>
        ) : (
          <>
            Con il badge di bronzo{" "}
            <Medal className={clsx(badgeColor[Badge.Bronze], "last:*:hidden")} /> per <b>tutte</b>{" "}
            le categorie sarai ammissibile alla Selezione Nazionale!
          </>
        )}
      </p>
      <p>
        All'interno di AlgoBadge troverai alcune dispense e videolezioni che ti possono aiutare a
        prepararti sui vari argomenti.
      </p>
      <p>
        <TriangleAlert className="text-warning !align-text-bottom" /> <b>NON COPIARE!!</b>{" "}
        <TriangleAlert className="text-warning !align-text-bottom" />
        <br />
        Al termine della fase AlgoBadge verranno fatti dei controlli anti-copiature, sia tra i vari
        concorrenti che verso risorse online e bot di intelligenza artificiale. Per questi
        controlli, verrà considerata solamente la soluzione più recente inviata per ogni studente e
        problema. Non è quindi necessario creare un account di training nuovo se hai soluzioni
        vecchie non originali: ti basta semplicemente mandare una nuova soluzione che sia tua
        originale.
      </p>
    </>
  );
}
