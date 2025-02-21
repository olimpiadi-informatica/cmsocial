import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Avatar, Card, CardBody } from "@olinfo/react-components";
import { AccessLevel, getMe, getUser, userPictureUrl } from "@olinfo/training-api";
import clsx from "clsx";
import { orderBy } from "lodash-es";

import { H1 } from "~/components/header";
import { loadLocale } from "~/lib/locale";

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params: { username } }: Props): Promise<Metadata> {
  const user = await getUser(username);
  if (!user) return {};

  const title = `Training - Profilo di ${username}`;
  const description = `Lista dei problemi risolti da ${user.first_name} ${user.last_name} (${username}) nella piattaforma di allenamento delle Olimpiadi Italiane di Informatica`;

  const image = {
    url: `${userPictureUrl(user)}&s=1200`,
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
      url: `https://training.olinfo.it/user/${username}`,
      description,
      firstName: user.first_name,
      lastName: user.last_name,
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

export default async function Page({ params: { username } }: Props) {
  const [_i18n, user, me] = await Promise.all([loadLocale(), getUser(username), getMe()]);
  if (!user) notFound();

  const { _ } = useLingui();

  return (
    <div className="flex flex-col gap-4">
      <H1 className="sr-only">
        <Trans>Profilo di {username}</Trans>
      </H1>
      <Card>
        <Avatar
          size={256}
          username={user.username}
          url={userPictureUrl(user)}
          className="max-sm:mx-auto max-sm:p-4"
        />
        <CardBody
          title={
            <>
              {user.username} <UserBadge level={user.access_level} />
            </>
          }>
          <div>
            {user.first_name} {user.last_name}
          </div>
          {user.institute && (
            <div className="text-sm text-base-content/80">
              {user.institute.name}, {user.institute.city}, {user.institute.region}
            </div>
          )}
          <div className="text-xl font-bold">
            <Trans>{user.score} punti</Trans>
          </div>
          {me?.username === user.username && (
            <div className="mt-auto">
              <Link href={`/user/${user.username}/edit/password`} className="link link-info">
                <Trans>Modifica profilo</Trans>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody title={_(msg`Problemi risolti`)}>
          <div className="sm:columns-2 md:columns-3 lg:columns-4">
            {orderBy(user.scores, ["score", "title"], ["desc", "asc"]).map((task) => (
              <TaskBadge key={task.name} {...task} />
            ))}
            {user.scores?.length === 0 && _(msg`Nessun problema risolto`)}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function UserBadge({ level }: { level: AccessLevel }) {
  switch (level) {
    case AccessLevel.Admin:
      return (
        <span className="badge badge-error">
          <Trans>Admin</Trans>
        </span>
      );
    case AccessLevel.Monica:
      return <span className="badge badge-secondary">Monica</span>;
    case AccessLevel.Tutor:
      return (
        <span className="badge badge-accent">
          <Trans>Tutor</Trans>
        </span>
      );
    case AccessLevel.Teacher:
      return (
        <span className="badge badge-primary">
          <Trans>Insegnante</Trans>
        </span>
      );
    case AccessLevel.Superuser:
      return (
        <span className="badge badge-success">
          <Trans>Aristocratico</Trans>
        </span>
      );
    case AccessLevel.User:
      return (
        <span className="badge badge-info">
          <Trans>Anziano</Trans>
        </span>
      );
    case AccessLevel.Newbie:
      return (
        <span className="badge badge-info">
          <Trans>Novizio</Trans>
        </span>
      );
    case AccessLevel.Guest:
      return (
        <span className="badge badge-info">
          <Trans>Ospite</Trans>
        </span>
      );
  }
}

function TaskBadge({ name, title, score }: { name: string; title: string; score: number }) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const scoreFraction = Math.min(Math.max(score / 100, 0), 1);
  const color = colors[Math.floor(scoreFraction * 4)];

  return (
    <div className="my-1 inline-block w-full">
      <Link
        href={`/task/${name}`}
        className={clsx("inline-block rounded-lg px-2 py-0.5 text-sm", color)}>
        {title} <span className="align-text-bottom text-xs">({Math.round(score)})</span>
      </Link>
    </div>
  );
}
