import { Trans } from "@lingui/react/macro";

import type { TaskListOptions } from "~/lib/api/tasks";

type Props = {
  options: TaskListOptions;
  setFilter: (values: Record<string, string>) => void;
  setPush: (push: boolean) => void;
};

export function UnsolvedFilter({ options, setFilter, setPush }: Props) {
  return (
    <div className="form-control w-full">
      <label className="label cursor-pointer">
        <span className="label-text">
          <Trans>Nascondi risolti</Trans>
        </span>
        <input
          type="checkbox"
          className="toggle"
          defaultChecked={options.unsolved ?? undefined}
          onChange={(e) => setFilter({ unsolved: e.target.checked ? "true" : "" })}
          onBlur={() => setPush(true)}
        />
      </label>
    </div>
  );
}
