import { useSearchParams } from "next/navigation";
import { useRef } from "react";

import { Slider } from "@base-ui/react/slider";
import { Trans } from "@lingui/react/macro";
import { sortBy } from "lodash-es";

import { getParamNumber } from "../utils";

type Props = {
  setFilter: (values: Record<string, string>) => void;
  setPush: (push: boolean) => void;
};

export function DifficultyFilter({ setFilter, setPush }: Props) {
  const searchParams = useSearchParams();
  const defaultDifficulty = useRef([
    getParamNumber(searchParams, "minDiff") ?? 0,
    getParamNumber(searchParams, "maxDiff") ?? 10,
  ]);

  return (
    <div className="form-control w-full">
      <div className="label pb-1.5">
        <span className="label-text">
          <Trans>Difficoltà</Trans>
        </span>
      </div>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        min={0}
        max={10}
        minStepsBetweenValues={1}
        defaultValue={defaultDifficulty.current}
        onValueChange={(values) => {
          const [mi, ma] = sortBy(values);
          setFilter({ minDiff: String(mi), maxDiff: String(ma) });
        }}
        onBlur={() => setPush(false)}>
        <Slider.Control className="flex w-full touch-none items-center p-3 select-none">
          <Slider.Track className="h-1 w-full rounded bg-base-300 select-none">
            <Slider.Indicator className="rounded bg-base-content/80 select-none" />
            <Slider.Thumb className="size-4 rounded-full bg-base-content select-none" />
            <Slider.Thumb className="size-4 rounded-full bg-base-content select-none" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  );
}
