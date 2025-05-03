"use client";

import { useParams, usePathname } from "next/navigation";
import { type MouseEvent, type Ref, type RefObject, forwardRef, useRef, useState } from "react";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
  Button,
  Form,
  Menu,
  Modal,
  SelectField,
  SubmitButton,
  useNotifications,
} from "@olinfo/react-components";
import { Eye, SquarePlus, Trash2 } from "lucide-react";

import { H2 } from "~/components/header";
import { Link } from "~/components/link";
import type { Tag } from "~/lib/api/tags";
import type { TaskTag } from "~/lib/api/task-tags";
import type { User } from "~/lib/api/user";
import { AccessLevel } from "~/lib/permissions";

import { addTag, removeTag } from "./actions";

type Props = {
  taskTags: TaskTag[];
  allTags: Tag[];
  user?: User;
  tagPlaceholders: string[];
};

export function PageClient({ taskTags, allTags, user, tagPlaceholders }: Props) {
  const { _ } = useLingui();

  const modalRef = useRef<HTMLDialogElement>(null);

  const isTagsPage = usePathname().endsWith("/tags");

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Tags</Trans>
      </H2>
      <Menu fallback={_(msg`Nessun tag`)}>
        {taskTags.map((tag, i) => (
          <li key={tag.name}>
            {tag.canDelete || tag.isEvent ? (
              <BaseTag tag={tag} />
            ) : (
              <HiddenTag tag={tag} placeholder={tagPlaceholders[i % tagPlaceholders.length]} />
            )}
          </li>
        ))}
      </Menu>
      {user && user.accessLevel <= AccessLevel.User && isTagsPage && (
        <div className="mt-4 flex justify-center">
          <Button className="btn-primary" onClick={() => modalRef.current?.showModal()}>
            <SquarePlus size={22} /> <Trans>Aggiungi tag</Trans>
          </Button>
          <AddTagModal
            ref={modalRef}
            tags={allTags.filter((tag) => !taskTags.some((taskTag) => taskTag.name === tag.name))}
          />
        </div>
      )}
    </div>
  );
}

function BaseTag({ tag }: { tag: TaskTag }) {
  const { name: taskName } = useParams();
  const { notifySuccess } = useNotifications();
  const { _ } = useLingui();

  const remove = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const err = await removeTag(taskName as string, tag.name);
    if (err) throw new Error(_(err));
    notifySuccess(_(msg`Tag rimosso con successo`));
  };

  return (
    <Link href={`/tasks/1?tag=${tag.name}`}>
      {tag.description}
      {tag.canDelete && (
        <button className="btn btn-ghost btn-xs justify-self-end" onClick={remove} type="button">
          <Trash2 size={18} />
        </button>
      )}
    </Link>
  );
}

function HiddenTag({ tag, placeholder }: { tag: TaskTag; placeholder: string }) {
  const { _ } = useLingui();

  const [shown, setShown] = useState(false);

  if (shown) return <BaseTag tag={tag} />;

  return (
    <button onClick={() => setShown(true)} aria-label={_(msg`Mostra tag`)} type="button">
      <div className="blur-sm" aria-hidden={true}>
        {placeholder}
      </div>
      <div className="mr-px justify-self-end px-2">
        <Eye size={18} />
      </div>
    </button>
  );
}

const AddTagModal = forwardRef(function AddTagModal(
  { tags }: { tags: Tag[] },
  ref: Ref<HTMLDialogElement> | null,
) {
  const { name: taskName } = useParams();
  const { notifySuccess } = useNotifications();
  const { _ } = useLingui();

  const options = Object.fromEntries(tags.map((tag) => [tag.name, tag.description]));

  const submit = async (data: { tag: string }) => {
    const err = await addTag(taskName as string, data.tag);
    if (err) throw new Error(_(err));
    (ref as RefObject<HTMLDialogElement>).current?.close();
    notifySuccess(_(msg`Tag aggiunto con successo`));
  };

  return (
    <Modal ref={ref} title={_(msg`Aggiungi tag`)}>
      <Form onSubmit={submit} className="!max-w-none">
        <SelectField
          field="tag"
          label={_(msg`Tag`)}
          placeholder={_(msg`Seleziona un tag`)}
          options={options}
        />
        <SubmitButton>
          <Trans>Aggiungi</Trans>
        </SubmitButton>
      </Form>
    </Modal>
  );
});
