import { SiTelegram } from "@icons-pack/react-simple-icons";
import { BookText, Globe, UsersRound } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Intro() {
  return (
    <div>
      <p>
        Questo argomento è dedicato a prendere confidenza con la piattaforma di allenamento, con il
        formato dei problemi, grader e subtask di varia complessità.
      </p>
      <p>
        Se hai bisogno di approfondire il funzionamento della piattaforma o incontri delle
        difficoltà, puoi consultare i seguenti materiali o chiedere aiuto alla community.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Guida per le selezioni territoriali"
            subtitle="Capitolo 1"
            url="/bugatti.pdf#page=11"
            icon={BookText}
          />
          <ResourceLink
            title="Guida ai grader"
            subtitle="di Edoardo Morassutto"
            url="https://wiki.olinfo.it/it/Guide/grader"
            icon={BookText}
          />
        </ResourceList>
        <ResourceList title="Community">
          <ResourceLink
            title="Forum"
            subtitle="dove chiedere o dare consigli sui problemi"
            url="https://forum.olinfo.it/"
            icon={UsersRound}
          />
          <ResourceLink
            title="Telegram"
            subtitle="dove parlare di qualsiasi cosa con altri olimpionici"
            url="https://t.me/+Zp70NXu5W04xMjQ0"
            icon={SiTelegram}
          />
        </ResourceList>
      </Resources>
      <hr />
      <p>
        Di seguito alcuni materiali di approfondimento, anche se non strettamente necessari per
        superare questo argomento.
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="Competitive Programmer's Handbook"
            subtitle="di Antti Laaksonen"
            url="https://cses.fi/book/index.php"
            icon={BookText}
          />
          <ResourceLink
            title="USACO Guide"
            subtitle="Piattaforma di allenamento statunitense"
            url="https://usaco.guide/"
            icon={Globe}
          />
        </ResourceList>
        <ResourceVideo
          id="8sr5Of-Bb1s"
          title="Parlare di algoritmi"
          author="Giorgio Audrito (stage PO 2021)"
          buttons={[
            { label: "Slide", url: "https://wiki.olinfo.it/2021/parlare_di_algoritmi.pdf" },
          ]}
        />
        <ResourceVideo
          id="OWfg-uqAgeQ"
          title="Algoritmica"
          author="Andrea Ciprietti (stage PO 2022)"
          buttons={[
            { label: "Appunti", url: "https://wiki.olinfo.it/2022/lezione_1_-_algoritmica.pdf" },
          ]}
        />
      </Resources>
    </div>
  );
}
