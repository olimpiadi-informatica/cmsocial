import { useSearchParams } from "next/navigation";
import { type Ref, type RefObject, forwardRef, useRef, useState } from "react";

import { Trans, useLingui } from "@lingui/react/macro";
import { Form, Modal, SelectField, SubmitButton } from "@olinfo/react-components";
import { Plus, X } from "lucide-react";

import type { Tag } from "~/lib/api/tags";

export function Filter({ allTags }: { allTags: Tag[] }) {
  const searchParams = useSearchParams();
  const { t } = useLingui();
  const ref = useRef<HTMLDialogElement>(null);

  const [push, setPush] = useState(true);

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

  const tags = searchParams.getAll("tag");

  return (
    <>
      <form
        role="search"
        className="flex flex-col gap-2 w-full max-sm:min-h-0 max-sm:last:*:mb-4"
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
          <div className="label pb-1.5">
            <span className="label-text">
              <Trans>Tag</Trans>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 my-2">
            {tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
            <button
              type="button"
              className="badge badge-neutral badge-xl flex h-6 gap-1"
              onClick={() => ref.current?.showModal()}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </form>
      <TagModal ref={ref} tags={allTags.filter((tag) => !tags.includes(tag.name))} />
    </>
  );
}

function TagChip({ tag }: { tag: string }) {
  const searchParams = useSearchParams();
  const { t } = useLingui();

  const newParams = new URLSearchParams(searchParams);
  newParams.delete("tag", tag);

  const removeTag = () => {
    window.history.pushState(null, "", `/tasks/1?${newParams}`);
  };

  return (
    <div className="badge badge-neutral badge-xl flex h-6 gap-1">
      <button type="button" onClick={removeTag} aria-label={t`Rimuovi filtro ${tag}`}>
        <X size={14} />
      </button>
      {tag}
    </div>
  );
}

const TagModal = forwardRef(function AddTagModal(
  { tags }: { tags: Tag[] },
  ref: Ref<HTMLDialogElement> | null,
) {
  const searchParams = useSearchParams();
  const { t } = useLingui();

  const options = Object.fromEntries(tags.map((tag) => [tag.name, tag.description]));

  const submit = (data: { tag: string }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.append("tag", data.tag);
    window.history.pushState(null, "", `/tasks/1?${newParams}`);
    (ref as RefObject<HTMLDialogElement>).current?.close();
  };

  return (
    <Modal ref={ref} title={t`Filtra tag`}>
      <Form onSubmit={submit} className="!max-w-none">
        <SelectField
          field="tag"
          label={t`Tag`}
          placeholder={t`Seleziona un tag`}
          options={options}
        />
        <SubmitButton>
          <Trans>Filtra</Trans>
        </SubmitButton>
      </Form>
    </Modal>
  );
});
