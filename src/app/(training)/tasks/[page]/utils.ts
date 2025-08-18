import { compact, uniq } from "lodash-es";

import type { TaskListOptions } from "~/lib/api/tasks";

export type Params = Record<string, string | string[] | undefined> | URLSearchParams;

export function getOptions(params: Params): TaskListOptions {
  return {
    search: getParamString(params, "search"),
    tags: getParamArray(params, "tag"),
    order: getParamString(params, "order"),
    unsolved: !!getParamString(params, "unsolved"),
    minDiff: convertDifficulty(getParamNumber(params, "minDiff")),
    maxDiff: convertDifficulty(getParamNumber(params, "maxDiff")),
  };
}

function convertDifficulty(level: number | null | undefined) {
  if (level == null || level < 0 || level > 10) return;
  return 10 ** ((level - 0.5) / 4.5 - 1);
}

export function getParamString(params: Params, name: string): string | null | undefined {
  const value = params instanceof URLSearchParams ? params.get(name) : params[name];
  return Array.isArray(value) ? value[0] : value;
}

export function getParamArray(params: Params, name: string): string[] {
  const value = params instanceof URLSearchParams ? params.getAll(name) : params[name];
  if (!value) return [];
  return compact(Array.isArray(value) ? uniq(value) : [value]);
}

export function getParamNumber(params: Params, name: string) {
  const rawValue = getParamString(params, name);
  if (!rawValue) return;

  const value = Number(rawValue);
  return Number.isNaN(value) ? undefined : value;
}
