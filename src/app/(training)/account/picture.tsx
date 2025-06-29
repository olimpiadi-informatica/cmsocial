"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GravatarQuickEditorCore } from "@gravatar-com/quick-editor";
import { Avatar } from "@olinfo/react-components";
import { Pencil } from "lucide-react";

import type { User } from "~/lib/auth/types";

export function ProfilePicture({ user }: { user: User }) {
  const router = useRouter();
  const [quickEditor, setQuickEditor] = useState<GravatarQuickEditorCore>();

  useEffect(() => {
    setQuickEditor(
      new GravatarQuickEditorCore({
        email: user.email,
        scope: ["avatars"],
        onProfileUpdated: () => router.refresh(),
      }),
    );
  }, [user.email, router]);

  return (
    <div className="mx-auto mb-4 relative">
      <Avatar size={128} username={user.username} url={user.image} />
      <button
        className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 pointer"
        onClick={() => quickEditor?.open()}
        type="button">
        <Pencil size={16} />
      </button>
    </div>
  );
}
