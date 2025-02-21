import type { ComponentType } from "react";

import type { CategoryId } from "~/lib/algobadge";

import { DP } from "./dp";
import { DS } from "./ds";
import { Graph } from "./graph";
import { Greedy } from "./greedy";
import { Intro } from "./intro";
import { Lib } from "./lib";
import { Maths } from "./math";
import { Rec } from "./rec";

export const resources: Record<CategoryId, ComponentType<Record<never, any>>> = {
  dp: DP,
  ds: DS,
  graph: Graph,
  greedy: Greedy,
  intro: Intro,
  lib: Lib,
  math: Maths,
  rec: Rec,
};
