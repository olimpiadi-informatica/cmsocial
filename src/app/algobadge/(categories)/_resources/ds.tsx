import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function DS() {
  return (
    <div>
      <p>
        Questo argomento è dedicato alla programmazione di strutture dati, che memorizzano
        informazioni in modo da essere gestite efficientemente.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Competitve Programmer's Handbook"
            subtitle="Capitoli 4, 9 e 28"
            url="/cph.pdf#page=45"
            icon={BookText}
          />
          <ResourceLink
            title="Query su array"
            subtitle="di Gabriele Farina"
            url="https://wiki.olinfo.it/2022/array_query.pdf"
            icon={BookText}
          />
          <ResourceLink
            title="Introduzione ai Segment Tree"
            subtitle="di Matteo Arcari"
            url="https://wiki.olinfo.it/lezioni/segment-tree-1"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo
          id="iHGCXrqnFO8"
          title="Strutture Dati"
          author="Dario Ostuni"
          params="playlist=iHGCXrqnFO8,VvgN2o8T-98"
        />
        <ResourceVideo
          id="JE-boQhJoDU"
          title="Strutture dati"
          author="Dario Petrillo (stage PO 2022)"
          buttons={[
            { label: "Appunti", url: "https://wiki.olinfo.it/2022/stage_1_-_strutture_dati.pdf" },
          ]}
        />
        <ResourceVideo
          id="OiPTvT8Dlp0"
          title="Strutture Dati"
          author="Federico Glaudo e Andrea Ciprietti (stage PO 2021)"
          buttons={[
            {
              label: "Appunti 1ᵃ parte",
              url: "https://wiki.olinfo.it/2021/lezione_3_-_strutture_dati.pdf",
            },
            {
              label: "Appunti 2ᵃ parte",
              url: "https://wiki.olinfo.it/2021/heap_bbst_hashset_lca_dario2994.pdf",
            },
          ]}
        />
      </Resources>
    </div>
  );
}
