import { Trans, useLingui } from "@lingui/react/macro";

import type { TaskListOptions } from "~/lib/api/tasks";

type Props = {
  options: TaskListOptions;
  setFilter: (values: Record<string, string>) => void;
  setPush: (push: boolean) => void;
};

export function SearchFilter({ options, setFilter, setPush }: Props) {
  const { t } = useLingui();

  return (
    <label className="form-control w-full">
      <div className="label pb-1.5">
        <span className="label-text">
          <Trans>Nome</Trans>
        </span>
      </div>
      <input
        className="input input-bordered w-full placeholder:opacity-50"
        name="task"
        type="search"
        placeholder={t`Nome del problema`}
        defaultValue={options.search ?? undefined}
        onChange={(e) => setFilter({ search: e.target.value })}
        onBlur={() => setPush(true)}
        size={1}
      />
    </label>
  );
}
