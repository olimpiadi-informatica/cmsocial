import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function DP() {
  return (
    <div>
      <p>
        In questo argomento si affronta la programmazione dinamica, per cui algoritmi ricorsivi
        esponenziali diventano polinomiali, tramite memorizzazione dei risultati di sotto-problemi.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Guida per le selezioni territoriali"
            subtitle="Capitolo 7"
            url="/bugatti.pdf#page=66"
            icon={BookText}
          />
          <ResourceLink
            title="Competitve Programmer's Handbook"
            subtitle="Capitolo 7"
            url="/cph.pdf#page=75"
            icon={BookText}
          />
          <ResourceLink
            title="Programmazione dinamica"
            subtitle="Dispense UniMI"
            url="https://wiki.olinfo.it/extra/unimi/dinamica.pdf"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo
          id="3tOMj7xZv1U"
          title="Programmazione dinamica"
          author="Andrea Ciprietti (stage PO 2021)"
          buttons={[{ label: "Appunti", url: "https://wiki.olinfo.it/2021/lezione_4_-_dp.pdf" }]}
        />
        <ResourceVideo
          id="dT5wMqCzp9I"
          title="Programmazione dinamica"
          author="Dario Ostuni"
          params="playlist=dT5wMqCzp9I,Ubb-SwvMAq4,30joNrPY7MA,BCxaH6B5wgg"
        />
      </Resources>
    </div>
  );
}
