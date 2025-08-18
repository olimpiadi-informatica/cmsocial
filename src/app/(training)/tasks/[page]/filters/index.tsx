import { useSearchParams } from "next/navigation";
import { useState } from "react";

import type { Tag } from "~/lib/api/tags";

import { getOptions } from "../utils";
import { DifficultyFilter } from "./difficulty";
import { SearchFilter } from "./search";
import { SortingFilter } from "./sorting";
import { TagsFilter } from "./tags";
import { UnsolvedFilter } from "./unsolved";

export function Filters({ allTags }: { allTags: Tag[] }) {
  const searchParams = useSearchParams();
  const options = getOptions(searchParams);

  const [push, setPush] = useState(true);

  const setFilter = (newValues: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(newValues)) {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    }
    if (push) {
      window.history.pushState(null, "", `/tasks/1?${newParams}`);
      setPush(false);
    } else {
      window.history.replaceState(null, "", `/tasks/1?${newParams}`);
    }
  };

  return (
    <form
      role="search"
      className="flex flex-col gap-2 w-full min-h-0"
      onSubmit={(e) => e.preventDefault()}>
      <SearchFilter options={options} setFilter={setFilter} setPush={setPush} />
      <SortingFilter options={options} setFilter={setFilter} setPush={setPush} />
      <DifficultyFilter setFilter={setFilter} setPush={setPush} />
      <UnsolvedFilter options={options} setFilter={setFilter} setPush={setPush} />
      <TagsFilter allTags={allTags} />
    </form>
  );
}
