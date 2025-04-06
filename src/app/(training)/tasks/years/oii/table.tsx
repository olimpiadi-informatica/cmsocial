"use client";

import { sumBy } from "lodash-es";

import { Table } from "~/components/table";
import { TaskBadge } from "~/components/task-badge";
import type { TaskItem } from "~/lib/api/events";

type YearTasks = {
  tag: string;
  year: number;
  tasks: TaskItem[];
};

export function OiiTable({ years }: { years: YearTasks[] }) {
  return (
    <Table
      data={years}
      header={TableHeaders}
      row={TableRow}
      className="grid-cols-[auto_repeat(3,1fr)]"
    />
  );
}

function TableHeaders() {
  return (
    <>
      <div>Anno</div>
      <div>Territoriali</div>
      <div>Pre-OII</div>
      <div>Nazionali</div>
    </>
  );
}

function TableRow({ item: yearTasks }: { item: YearTasks }) {
  const year = yearTasks.year;

  const score = sumBy(yearTasks.tasks, (t) => t.score ?? 0);
  const maxScore = sumBy(yearTasks.tasks, (t) => t.maxScore);

  return (
    <>
      <div>
        <div>
          {year >= 2010 && `${year - 2}/${((year - 1) % 100).toString().padStart(2, "0")}`}
          {year < 2010 && year}
        </div>
        {maxScore > 0 && <div>{Math.round((score / maxScore) * 100)}%</div>}
      </div>
      <div className="flex flex-col items-center min-w-56 text-wrap">
        <YearBadges year={yearTasks} event="territoriali" />
      </div>
      <div className="flex flex-col items-center min-w-56 text-wrap">
        <YearBadges year={yearTasks} event="pre-oii" />
      </div>
      <div className="flex flex-col items-center min-w-56 text-wrap">
        <YearBadges year={yearTasks} event="nazionali" />
      </div>
    </>
  );
}

function YearBadges({ year, event }: { year: YearTasks; event: string }) {
  return year.tasks
    .filter((task) => task.tags.includes(event))
    .map((task) => <TaskBadge key={task.name} {...task} score={task.score ?? 0} />);
}
