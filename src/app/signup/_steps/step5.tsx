"use client";

import { Trans } from "@lingui/react/macro";
import { CardActions } from "@olinfo/react-components";
import { List } from "lucide-react";

import { Link } from "~/components/link";

export function Step5() {
  return (
    <>
      <div className="text-center">
        <Trans>Hai completato la registrazione! Puoi inziare a risolvere i problemi</Trans>
      </div>
      <CardActions>
        <Link href="/tasks/1?order=easiest" className="btn btn-primary">
          <List size={20} />
          <Trans>Vai ai problemi</Trans>
        </Link>
      </CardActions>
    </>
  );
}
