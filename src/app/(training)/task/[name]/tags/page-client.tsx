"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type MouseEvent, type Ref, type RefObject, forwardRef, useRef, useState } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Button,
  Form,
  Menu,
  Modal,
  SelectField,
  SubmitButton,
  useNotifications,
} from "@olinfo/react-components";
import type { Tag, Task } from "@olinfo/training-api";
import { sortBy } from "lodash-es";
import { Eye, SquarePlus, Trash2 } from "lucide-react";

import { H2 } from "~/components/header";

import { addTag, removeTag } from "./actions";

type Props = {
  task: Task;
  tags: string[];
  eventTags: string[];
  isLogged: boolean;
  tagPlaceholders: string[];
};

export function PageClient({ task, tags, eventTags, isLogged, tagPlaceholders }: Props) {
  const { _ } = useLingui();
  const router = useRouter();

  const modalRef = useRef<HTMLDialogElement>(null);

  const path = usePathname();
  const isTagsPage = usePathname().endsWith("/tags");
  const taskTags = sortBy(task.tags, [(t) => !eventTags.includes(t.name), "name"]);

  const openModal = async () => {
    if (!isLogged) {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      await new Promise(() => {});
    }
    modalRef.current?.showModal();
  };

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Tags</Trans>
      </H2>
      <Menu fallback={_(msg`Nessun tag`)}>
        {taskTags.map((tag, i) => (
          <li key={tag.name}>
            {tag.can_delete || eventTags.includes(tag.name) ? (
              <BaseTag tag={tag} />
            ) : (
              <HiddenTag tag={tag} placeholder={tagPlaceholders[i % tagPlaceholders.length]} />
            )}
          </li>
        ))}
      </Menu>
      {isTagsPage && (
        <div className="mt-4 flex justify-center">
          <Button className="btn-primary" onClick={openModal}>
            <SquarePlus size={22} /> <Trans>Aggiungi tag</Trans>
          </Button>
          <AddTagModal ref={modalRef} taskName={task.name} tags={tags} />
        </div>
      )}
    </div>
  );
}

function BaseTag({ tag }: { tag: Tag }) {
  const { name: taskName } = useParams();
  const { notifySuccess } = useNotifications();
  const { _ } = useLingui();

  const remove = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const err = await removeTag(taskName as string, tag.name);
    if (err) throw new Error(err);
    notifySuccess(_(msg`Tag rimosso con successo`));
  };

  return (
    <Link href={`/tasks/1?tag=${tag.name}`} className="font-mono">
      {tag.name}
      {tag.can_delete && (
        <button className="btn btn-ghost btn-xs justify-self-end" onClick={remove} type="button">
          <Trash2 size={18} />
        </button>
      )}
    </Link>
  );
}

function HiddenTag({ tag, placeholder }: { tag: Tag; placeholder: string }) {
  const { _ } = useLingui();

  const [shown, setShown] = useState(false);

  if (shown) return <BaseTag tag={tag} />;

  return (
    <button
      className="font-mono"
      onClick={() => setShown(true)}
      aria-label={_(msg`Mostra tag`)}
      type="button">
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
  { taskName, tags }: { taskName: string; tags: string[] },
  ref: Ref<HTMLDialogElement> | null,
) {
  const { notifySuccess } = useNotifications();
  const { _ } = useLingui();

  const options = Object.fromEntries(sortBy(tags).map((tag) => [tag, tag]));

  const submit = async (data: { tag: string }) => {
    const err = await addTag(taskName, data.tag);
    if (err) {
      switch (err) {
        case "The task already has this tag":
          throw new Error(_(msg`Il task ha già questo tag`), { cause: { field: "tag" } });
        default:
          throw err;
      }
    }
    (ref as RefObject<HTMLDialogElement>).current?.close();
    notifySuccess(_(msg`Tag aggiunto con successo`));
  };

  return (
    <Modal ref={ref} title={_(msg`Aggiungi tag`)}>
      <Form onSubmit={submit}>
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
