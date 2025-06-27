import { useSearchParams } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

import type { Tag } from "~/lib/api/tags";

export function Filter({ allTags }: { allTags: Tag[] }) {
  const searchParams = useSearchParams();
  const { t } = useLingui();

  const [push, setPush] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
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
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => setFilter("search", e.target.value)}
          onBlur={() => setPush(true)}
          size={1}
        />
      </label>
      <label className="form-control w-full">
        <div className="label pb-1.5">
          <span className="label-text">
            <Trans>Ordinamento</Trans>
          </span>
        </div>
        <select
          className="select select-bordered w-full"
          defaultValue={searchParams.get("order") ?? ""}
          onChange={(e) => setFilter("order", e.target.value)}
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
      <div className="form-control w-full">
        <label className="label cursor-pointer">
          <span className="label-text">
            <Trans>Nascondi risolti</Trans>
          </span>
          <input
            type="checkbox"
            className="toggle"
            defaultChecked={!!searchParams.get("unsolved")}
            onChange={(e) => setFilter("unsolved", e.target.checked ? "true" : "")}
            onBlur={() => setPush(true)}
          />
        </label>
      </div>
      <div className="form-control w-full">
        <label className="label pb-1.5">
          <span className="label-text">
            <Trans>Tag</Trans>
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
    </form>
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
