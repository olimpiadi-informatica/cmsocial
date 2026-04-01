import type { ReactNode } from "react";

import { Trans } from "@lingui/react/macro";
import { Avatar } from "@olinfo/react-components";
import clsx from "clsx";
import { BookText, type LucideIcon, Route } from "lucide-react";

import { Link } from "~/components/link";
import { getTaskList, type TaskListOptions } from "~/lib/api/tasks";
import { getRanking } from "~/lib/api/users";
import { loadLocale } from "~/lib/locale";

import { Footer } from "./footer";
import style from "./home.module.css";

export default async function Home() {
  await loadLocale();

  const topTasks = await getTaskList({} as TaskListOptions, undefined, 1, 3);
  const topUsers = await getRanking(1, 3);

  return (
    <>
      <main className="mx-auto max-w-screen-xl flex grow flex-col gap-8 p-4 pb-8">
        <div className="hero">
          <div className="hero-content flex-col xl:flex-row xl:justify-between w-full gap-12">
            <div className="flex flex-col items-center text-center max-xl:max-w-2xl">
              <h1 className={clsx("text-pretty text-4xl lg:text-5xl font-extrabold", style.title)}>
                <Trans>
                  <span>Portale di allenamento delle</span>{" "}
                  <span className={style.titleGradient}>Olimpiadi Italiane di Informatica</span>
                </Trans>
              </h1>
              <p className="py-4 text-xl">
                <Trans>
                  Benvenuto nella piattaforma ufficiale di allenamento per le OII! Qui avrai accesso
                  a numerosi problemi ai quali potrai inviare delle soluzioni scritte in un
                  linguaggio di programmazione a tua scelta.
                </Trans>
              </p>
              <Link href="/tasks/1" className="btn btn-accent" prefetch>
                <Trans>Inizia ad allenarti</Trans>
              </Link>
            </div>
            <div className="group relative w-full max-xl:max-w-none xl:max-w-md xl:h-[400px] h-80 sm:h-96 items-center justify-center shrink-0 cursor-pointer flex">
              {topTasks.map((task, i) => {
                const classNames =
                  [
                    "-rotate-[8deg] max-sm:-translate-x-10 sm:-translate-x-16 translate-y-3 z-10 max-sm:group-hover:-translate-x-14 sm:group-hover:-translate-x-28 group-hover:-rotate-12",
                    "rotate-[6deg] max-sm:translate-x-10 sm:translate-x-16 translate-y-6 z-20 max-sm:group-hover:translate-x-14 sm:group-hover:translate-x-28 group-hover:rotate-12",
                    "scale-105 z-30 shadow-2xl group-hover:translate-y-1",
                  ][i] || "";

                return (
                  <Link
                    key={task.name}
                    href={`/task/${task.name}`}
                    prefetch
                    className={clsx(
                      "absolute max-sm:size-[220px] sm:size-[280px] overflow-hidden rounded-xl border border-base-content/10 bg-base-100 transition-all duration-500 ease-out",
                      "hover:!scale-110 hover:!z-50 hover:-translate-y-2",
                      classNames,
                    )}>
                    <img
                      src={`/files/task-preview/${task.name}`}
                      alt={task.title}
                      className="size-full object-cover object-top"
                      fetchPriority={i === 2 ? "high" : "low"}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-base-content/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-base-content/30 *:bg-base-200">
            <div className="lg:col-span-2">
              <div className="flex flex-col justify-center items-center text-center p-8 h-full">
                <h2 className="text-2xl font-bold mb-4">
                  <Trans>Risolvi tutti i problemi</Trans>
                </h2>
                <p className="mb-6">
                  <Trans>
                    La vasta scelta di problemi presenti nel sito ti permetterà di prepararti al
                    meglio per ogni fase delle Olimpiadi, partendo dalla fase scolastica fino ad
                    arrivare alla finale nazionale.
                  </Trans>
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/scolastiche" className="btn btn-accent" prefetch>
                    <Trans>Scolastiche</Trans>
                  </Link>
                  <Link href="/tasks/terry/1" className="btn btn-accent" prefetch>
                    <Trans>Territoriali</Trans>
                  </Link>
                  <Link href="/tasks/1" className="btn btn-accent" prefetch>
                    <Trans>Nazionali, OIS e altre gare</Trans>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-center items-center text-center p-8 h-full">
                <h2 className="text-2xl font-bold mb-4">
                  <Trans>Leggi la wiki</Trans>
                </h2>
                <p className="mb-6">
                  <Trans>
                    Nella wiki ufficiale troverai spiegazioni dettagliate e soluzioni di problemi
                    passati, oltre che a tutorial approfonditi su tecniche algoritmiche avanzate.
                  </Trans>
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <CardButton href="https://wiki.olinfo.it" icon={BookText}>
                    <Trans>Wiki</Trans>
                  </CardButton>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-center items-center text-center p-8 h-full">
                <h2 className="text-2xl font-bold mb-4">
                  <Trans>Impara gradualmente</Trans>
                </h2>
                <p className="mb-6">
                  <Trans>
                    Con Algobadge ti guideremo attraverso una selezione di task, ordinati per
                    difficoltà, che ti permetteranno di esplorare nuove tecniche algoritmiche in
                    modo graduale.
                  </Trans>
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <CardButton href="/algobadge" icon={Route}>
                    <Trans>Algobadge</Trans>
                  </CardButton>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex flex-col justify-center items-center text-center p-8 h-full">
                <h2 className="text-2xl font-bold mb-4">
                  <Trans>Padroneggia tutte le tecniche</Trans>
                </h2>
                <p className="mb-6">
                  <Trans>
                    Esplora e padroneggia le principali tecniche algoritmiche selezionando i task
                    per categoria. Sviluppa le tue competenze in programmazione dinamica, algoritmi
                    su grafi e strutture dati avanzate.
                  </Trans>
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/tasks/1?tag=graphs" className="btn btn-accent" prefetch>
                    <Trans>Grafi</Trans>
                  </Link>
                  <Link href="/tasks/1?tag=data_structures" className="btn btn-accent" prefetch>
                    <Trans>Strutture dati</Trans>
                  </Link>
                  <Link href="/tasks/techniques" className="btn btn-accent" prefetch>
                    <Trans>Tutte le categorie</Trans>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col xl:flex-row gap-8 xl:gap-12 p-8 items-center xl:justify-center">
          <div className="flex flex-col justify-center xl:w-1/3 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <Trans>Sfida i nostri campioni</Trans>
            </h2>
            <p className="text-lg text-base-content/70">
              <Trans>
                Guarda i migliori programmatori della nostra comunità e vedi come ti posizioni nella
                classifica. Mettiti alla prova e sali fino in cima al podio risolvendo i problemi
                più difficili!
              </Trans>
            </p>
          </div>
          <div className="flex flex-row justify-center sm:items-end items-start gap-1 sm:gap-2 lg:gap-4 w-full flex-wrap">
            {topUsers.map((user, idx) => {
              const medals = ["🥇", "🥈", "🥉"];
              const stepHeights = ["h-40", "h-24", "h-16"];
              const stepGradients = [
                "from-yellow-400 to-yellow-600",
                "from-slate-400 to-slate-600",
                "from-amber-600 to-amber-800",
              ];
              const avatarBorders = ["border-yellow-400", "border-slate-400", "border-amber-600"];
              const avatarSize = [80, 64, 64][idx];

              return (
                <Link
                  key={user.id}
                  href={`/user/${user.username}`}
                  className={clsx(
                    "flex flex-col items-center gap-3 group w-28 sm:w-36 lg:w-44 flex-shrink-0",
                    ["max-sm:basis-full sm:order-2", "sm:order-1", "sm:order-3"][idx],
                  )}>
                  <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:-translate-y-2">
                    <span className="text-4xl">{medals[idx]}</span>
                    <Avatar
                      size={avatarSize}
                      username={user.username}
                      url={user.image}
                      className={clsx("rounded-xl border-4", avatarBorders[idx], style.avatar)}
                    />
                    <div className="text-center">
                      <div className="font-bold text-sm lg:text-base leading-tight">
                        {user.username}
                      </div>
                      <div className="text-xs text-base-content/60 mt-0.5">{user.name}</div>
                      <div className="font-mono font-bold text-accent text-sm mt-1">
                        {user.score}
                      </div>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "hidden sm:flex w-full rounded-t-xl items-center justify-center font-bold text-xl text-white bg-gradient-to-b shadow-lg",
                      stepHeights[idx],
                      stepGradients[idx],
                    )}>
                    #{idx + 1}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

type ButtonProps = {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
};

function CardButton({ href, icon: Icon, children }: ButtonProps) {
  return (
    <Link className="btn btn-accent" href={href}>
      <Icon size={20} />
      {children}
    </Link>
  );
}
