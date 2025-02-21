import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card } from "@olinfo/react-components";
import { mapValues } from "lodash-es";

import { type UserBadges, badgeName } from "./common";
import { SummaryBadges } from "./summary-badges";
import { SummaryCategories } from "./summary-categories";
import { SummaryTotal } from "./summary-total";

export function Summary({ users }: { users: UserBadges }) {
  const { _ } = useLingui();

  const download = async () => {
    const userBadges = mapValues(users, (user) =>
      user
        ? {
            total: _(badgeName[user.totalBadge]),
            ...mapValues(user.badges, ({ badge }) => _(badgeName[badge])),
          }
        : null,
    );

    try {
      const handle = await window.showSaveFilePicker({ suggestedName: "algobadge.json" });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(userBadges, null, 2));
      await writable.close();
    } catch (err) {
      throw new Error(
        window.location.protocol !== "https:" && window.location.hostname !== "localhost"
          ? _(msg`Devi usare HTTPS per scaricare il file.`)
          : _(msg`Browser non supportato. Usa Chrome o Edge.`),
        { cause: err },
      );
    }
  };

  return (
    <Card className="flex-wrap p-4 *:basis-full justify-between">
      <div className="md:basis-4/12 lg:basis-3/12">
        <h2 className="text-center text-2xl">
          <Trans>Totale</Trans>
        </h2>
        <SummaryTotal users={users} />
      </div>
      <div className="md:basis-7/12 lg:basis-4/12">
        <h2 className="text-center text-2xl">
          <Trans>Badge</Trans>
        </h2>
        <SummaryBadges users={users} />
      </div>
      <div className="lg:basis-5/12">
        <h2 className="text-center text-2xl">
          <Trans>Categorie</Trans>
        </h2>
        <SummaryCategories users={users} />
      </div>
      <div className="my-4 grid justify-center">
        <button className="btn btn-primary" onClick={download} type="button">
          <Trans>Scarica dati</Trans>
        </button>
      </div>
    </Card>
  );
}
