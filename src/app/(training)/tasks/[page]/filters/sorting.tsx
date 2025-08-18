import { Trans } from "@lingui/react/macro";

import type { TaskListOptions } from "~/lib/api/tasks";

type Props = {
  options: TaskListOptions;
  setFilter: (values: Record<string, string>) => void;
  setPush: (push: boolean) => void;
};

export function SortingFilter({ options, setFilter, setPush }: Props) {
  return (
    <label className="form-control w-full">
      <div className="label pb-1.5">
        <span className="label-text">
          <Trans>Ordinamento</Trans>
        </span>
      </div>
      <select
        className="select select-bordered w-full"
        defaultValue={options.order ?? undefined}
        onChange={(e) => setFilter({ order: e.target.value })}
        onBlur={() => setPush(true)}>
        <option value="">
          <Trans>Più recenti</Trans>
        </option>
        <option value="trending">
          <Trans>Di tendenza</Trans>
        </option>
        <option value="easiest">
          <Trans>Più facili</Trans>
        </option>
        <option value="hardest">
          <Trans>Più difficili</Trans>
        </option>
      </select>
    </label>
  );
}
