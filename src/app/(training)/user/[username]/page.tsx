import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Trans, useLingui } from "@lingui/react/macro";
import { Avatar, Card, CardBody } from "@olinfo/react-components";
import { Pencil } from "lucide-react";

import { DateTime } from "~/components/date";
import { H1 } from "~/components/header";
import { Link } from "~/components/link";
import { getSchool } from "~/lib/api/location";
import { getUser } from "~/lib/api/user";
import { loadLocale } from "~/lib/locale";
import { getSessionUser } from "~/lib/user";

import { ActivityGraph } from "./activity-graph";
import { Stats } from "./stats";
import { TaskScores } from "./task-scores";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const user = await getUser(username);
  if (!user) return {};

  const title = `Training - Profilo di ${username}`;
  const description = `Lista dei problemi risolti da ${user.firstName} ${user.lastName} (${username}) nella piattaforma di allenamento delle Olimpiadi Italiane di Informatica`;

  const image = {
    url: `${user.image}&s=1200`,
    height: 1200,
    width: 1200,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      type: "profile",
      images: image,
      url: `/user/${username}`,
      description,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
    twitter: {
      card: "summary_large_image",
      site: "@olimpiadi_info",
      title,
      description,
      images: image,
    },
  };
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  await loadLocale();
  const { t } = useLingui();

  const me = await getSessionUser();
  const user = await getUser(username);
  if (!user) notFound();

  const school = await getSchool(user.institute).catch(() => undefined);

  return (
    <div className="flex flex-col gap-4">
      <H1 className="sr-only">
        <Trans>Profilo di {username}</Trans>
      </H1>
      <Card>
        <div className="flex m-3">
          <Avatar
            size={256}
            username={user.username}
            url={user.image}
            className="max-sm:mx-auto max-sm:p-4"
          />
        </div>
        <CardBody
          title={
            <>
              {user.username} <UserBadge role={user.role} />
            </>
          }>
          <div>
            {user.firstName} {user.lastName}
          </div>
          {school && <div className="text-sm text-base-content/80">{school}</div>}
          <div className="text-sm text-base-content/80">
            <Trans>
              Utente dal{" "}
              <DateTime date={user.registrationTime} dateStyle="long" timeStyle="hidden" />
            </Trans>
          </div>
          {me?.username === user.username && (
            <div className="mt-auto">
              <Link href="/account/profile" className="btn btn-primary">
                <Pencil size={20} />
                <Trans>Modifica profilo</Trans>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody title={t`Statistiche`}>
          <Stats user={user} />
        </CardBody>
      </Card>
      <Card className="*:w-full">
        <CardBody title={t`Attività`}>
          <ActivityGraph user={user} />
        </CardBody>
      </Card>
      <Card>
        <CardBody title={t`Problemi risolti`}>
          <TaskScores user={user} />
        </CardBody>
      </Card>
    </div>
  );
}

function UserBadge({ role }: { role: "unverified" | "newbie" | "trusted" | "admin" | null }) {
  switch (role) {
    case "admin":
      return (
        <span className="badge badge-error">
          <Trans>Admin</Trans>
        </span>
      );
    case "trusted":
      return (
        <span className="badge badge-info">
          <Trans>Anziano</Trans>
        </span>
      );
    case "newbie":
      return (
        <span className="badge badge-info">
          <Trans>Novizio</Trans>
        </span>
      );
  }
}
