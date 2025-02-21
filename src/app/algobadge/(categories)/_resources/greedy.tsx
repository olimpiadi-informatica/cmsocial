import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Greedy() {
  return (
    <div>
      <p>
        Questo argomento è dedicato a problemi in cui semplici strategie di ottimizzazione locale
        portano al risultato corretto, utilizzando anche passaggi di ordinamento o ricerca.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Guida per le selezioni territoriali"
            subtitle="Capitoli 4 e 5"
            url="/bugatti.pdf#page=33"
            icon={BookText}
          />
          <ResourceLink
            title="Competitve Programmer's Handbook"
            subtitle="Capitoli 3 e 6"
            url="/cph.pdf#page=35"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo
          id="1_rIGry0IKw"
          title="Ricerca, ordinamento, selezione"
          author="Giorgio Audrito (stage PO 2021)"
          buttons={[
            {
              label: "Slide",
              url: "https://wiki.olinfo.it/2021/ricerca_ordinamento_selezione.pdf",
            },
          ]}
        />
        <ResourceVideo
          id="iG9M_lBOOew"
          title="Algoritmi di orinamento e ricerca binaria"
          author="Dario Ostuni"
          params="playlist=iG9M_lBOOew,8H9UC0KwTQU"
        />
        <ResourceVideo
          id="OWfg-uqAgeQ"
          title="Algoritmi di ordinamento"
          author="Andrea Ciprietti (stage PO 2022)"
          params="start=3821"
          buttons={[
            { label: "Appunti", url: "https://wiki.olinfo.it/2022/lezione_1_-_algoritmica.pdf" },
          ]}
        />
        <ResourceVideo
          id="Hrp7_O2LOh8"
          title="Algoritmi greedy"
          author="Marco Donadoni (stage PO 2021)"
          buttons={[{ label: "Slide", url: "https://wiki.olinfo.it/2021/greedy_backtracking.pdf" }]}
        />
      </Resources>
    </div>
  );
}
