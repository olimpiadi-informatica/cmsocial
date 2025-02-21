import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Graph() {
  return (
    <div>
      <p>
        In questo argomento si affrontano problemi su grafi, costituiti da nodi collegati a coppie
        da archi, tramite visite e calcolo di cammini minimi.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Guida per le selezioni territoriali"
            subtitle="Capitolo 8"
            url="/bugatti.pdf#page=76"
            icon={BookText}
          />
          <ResourceLink
            title="Competitve Programmer's Handbook"
            subtitle="Capitoli 11, 12 e 13"
            url="/cph.pdf#page=119"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo
          id="mIxwWL3oQV8"
          title="Grafi, BFS e DFS, Dijkstra"
          author="Dario Ostuni"
          params="playlist=mIxwWL3oQV8,_adGyh_FfFI,c3Xb9CztqYE,WQiAluRS2nw"
        />
        <ResourceVideo
          id="j3JTW445TOw"
          title="Algoritmi e nozioni base sui grafi"
          author="Edoardo Morassutto (stage PO 2022)"
          buttons={[
            { label: "Slide", url: "https://wiki.olinfo.it/2022/grafi_visite_cammini.pdf" },
          ]}
        />
      </Resources>
    </div>
  );
}
