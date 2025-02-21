import { BookText } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Maths() {
  return (
    <div>
      <p>
        Questa lezione presenta alcuni problemi con forte componente matematica, in particolare in
        riferimento alla combinatoria e alla teoria dei numeri.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Competitve Programmer's Handbook"
            subtitle="Capitoli 21 e 22"
            url="/cph.pdf#page=207"
            icon={BookText}
          />
          <ResourceLink
            title="Nozioni di base sulle permutazioni"
            subtitle="Dispense UniMI"
            url="https://wiki.olinfo.it/extra/unimi/permutazioni.pdf"
            icon={BookText}
          />
        </ResourceList>
        <ResourceVideo id="eroJMT_ODQ0" title="Aritmetica modulare" author="Dario Ostuni" />
        <ResourceVideo
          id="eQErzh2y9Kg"
          title="Matematica avanzata"
          author="Luca Versari (stage PO 2022)"
          buttons={[
            { label: "Appunti", url: "https://wiki.olinfo.it/2022/2021-12-05-note-17-22.pdf" },
          ]}
        />
      </Resources>
    </div>
  );
}
