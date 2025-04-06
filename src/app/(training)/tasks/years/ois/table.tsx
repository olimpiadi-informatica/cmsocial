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

export function OisTable({ years }: { years: YearTasks[] }) {
  return (
    <Table
      data={years}
      header={TableHeaders}
      row={TableRow}
      className="grid-cols-[auto_repeat(5,1fr)]"
    />
  );
}

function TableHeaders() {
  return (
    <>
      <div>Anno</div>
      <div>Round 1</div>
      <div>Round 2</div>
      <div>Round 3</div>
      <div>Round 4</div>
      <div>Finale</div>
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
          {year - 1}/{(year % 100).toString().padStart(2, "0")}
        </div>
        {maxScore > 0 && <div>{Math.round((score / maxScore) * 100)}%</div>}
      </div>
      {["ois-r1", "ois-r2", "ois-r3", "ois-r4", "ois-final"].map((event) => (
        <div key={event} className="flex flex-col items-center min-w-56 text-wrap">
          <YearBadges year={yearTasks} event={event} />
        </div>
      ))}
    </>
  );
}

function YearBadges({ year, event }: { year: YearTasks; event: string }) {
  return year.tasks
    .filter((task) => task.tags.includes(event))
    .map((task) => <TaskBadge key={task.name} {...task} score={task.score ?? 0} />);
}
