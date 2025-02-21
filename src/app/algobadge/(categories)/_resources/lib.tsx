import { BookText, Globe } from "lucide-react";

import { ResourceLink, ResourceList, ResourceVideo, Resources } from "~/components/resources";

export function Lib() {
  return (
    <div>
      <p>
        In questo argomento, dovrai familiarizzare con il linguaggio C++ e con quello che offre la
        sua libreria standard (STL).
      </p>
      <Resources>
        <ResourceList>
          <ResourceLink
            title="C++ Standard Template Library"
            subtitle="Topcoder"
            url="https://wiki.olinfo.it/Guide/stl"
            icon={BookText}
          />
          <ResourceLink
            title="Standard Library, struct e C++11"
            subtitle="di Giada Franz"
            url="https://wiki.olinfo.it/2022/stl.pdf"
            icon={BookText}
          />
          <ResourceLink
            title="Documentazione delle STL"
            url="https://en.cppreference.com/"
            icon={Globe}
          />
        </ResourceList>
        <ResourceVideo
          id="tfpESGWEShQ"
          title="C++ STL e tecniche di debug"
          author="Dario Ostuni (stage PO 2022)"
        />
      </Resources>
    </div>
  );
}
