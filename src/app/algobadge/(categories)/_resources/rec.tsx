import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Rec() {
  return (
    <div>
      <p>
        I problemi di questo argomento richiedono di ragionare in modo induttivo, cercando di
        derivare la soluzione al problema a partire da istanze più piccole dello stesso. Sebbene non
        sempre richiesta, in questi casi può aiutare pensare a una soluzione ricorsiva, che è poi
        solo un modo diverso di vedere l'induzione.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Guida per le selezioni territoriali"
            subtitle="Capitolo 6"
            url="/bugatti.pdf#page=54"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo
          id="8sr5Of-Bb1s"
          title="Ricorsione ed esponenziazione veloce"
          author="Giorgio Audrito (stage PO 2021)"
          buttons={[{ label: "Slide", url: "https://wiki.olinfo.it/2021/ricorsione_fastexp.pdf" }]}
        />
        <ResourceVideo
          id="OWfg-uqAgeQ"
          title="Induzione e ricorsione"
          author="Andrea Ciprietti (stage PO 2022)"
          params="start=2715"
          buttons={[
            { label: "Appunti", url: "https://wiki.olinfo.it/2022/lezione_1_-_algoritmica.pdf" },
          ]}
        />
      </Resources>
    </div>
  );
}
