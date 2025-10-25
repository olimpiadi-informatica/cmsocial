import { useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useState, ViewTransition } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

import type { Tag } from "~/lib/api/tags";

export function TagsFilter({ allTags }: { allTags: Tag[] }) {
  const [showAllTags, setShowAllTags] = useState(false);

  return (
    <div className="form-control w-full">
      <label className="label pb-1.5">
        <span className="label-text">
          <Trans>Tags</Trans>
        </span>
        <div className="btn btn-neutral btn-circle btn-sm swap swap-rotate">
          <input
            type="checkbox"
            checked={showAllTags}
            onChange={() => startTransition(() => setShowAllTags((show) => !show))}
          />
          <ChevronDown size={20} className="swap-off" />
          <ChevronUp size={20} className="swap-on" />
        </div>
      </label>
      <div className="flex flex-wrap gap-2 min-h-0 mb-4">
        {allTags.map((tag) => (
          <ViewTransition key={`tag-${tag.name}`}>
            <TagChip tag={tag} showAllTags={showAllTags} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}
function TagChip({ tag, showAllTags }: { tag: Tag; showAllTags: boolean }) {
  const { t } = useLingui();
  const params = useSearchParams();

  const isTagSelected = useDeferredValue(params.has("tag", tag.name));
  if (!showAllTags && !isTagSelected) return null;

  const toggleTag = () => {
    const newParams = new URLSearchParams(params);
    if (isTagSelected) {
      newParams.delete("tag", tag.name);
    } else {
      newParams.append("tag", tag.name);
    }
    window.history.pushState(null, "", `/tasks/1?${newParams}`);
  };

  return (
    <button
      type="button"
      onClick={toggleTag}
      className={clsx(
        "badge badge-xl flex h-6 gap-1",
        isTagSelected ? "badge-primary" : "badge-neutral",
      )}
      aria-label={
        isTagSelected ? t`Rimuovi tag ${tag.description}` : t`Aggiungi tag ${tag.description}`
      }>
      {isTagSelected ? <X size={14} /> : <Plus size={14} />}
      {tag.description}
    </button>
  );
}
