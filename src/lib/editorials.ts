import { cache } from "react";

import { differenceInDays } from "date-fns";
import { and, eq } from "drizzle-orm";

import { getTaskSubmissions } from "~/lib/api/submissions";
import { getTerrySubmissions } from "~/lib/api/submissions-terry";
import { cmsDb } from "~/lib/db";
import { editorials, taskEditorials } from "~/lib/db/schema";

export type MarkdownEditorial = {
  type: "markdown";
};

export type PdfEditorial = {
  type: "pdf";
  url: string;
};

export type Editorial = MarkdownEditorial | PdfEditorial;

export const getTaskEditorial = cache(async (taskName: string): Promise<Editorial | undefined> => {
  const res = await cmsDb
    .select({
      id: editorials.id,
      type: editorials.type,
      url: editorials.url,
      digest: editorials.digest,
      page: taskEditorials.page,
    })
    .from(taskEditorials)
    .innerJoin(editorials, eq(editorials.id, taskEditorials.editorialId))
    .where(and(eq(taskEditorials.taskName, taskName), eq(taskEditorials.isTerry, false)))
    .limit(1);

  const row = res[0];
  if (!row) return undefined;

  if (row.type === "markdown") {
    return { type: "markdown" };
  }
  if (row.type === "pdf_url") {
    return {
      type: "pdf",
      url: `/files/editorial-pdf/${taskName}${row.page ? `#page=${row.page}` : ""}`,
    };
  }
  if (row.type === "pdf_file") {
    return {
      type: "pdf",
      url: `/files/${row.digest}/editorial.pdf${row.page ? `#page=${row.page}` : ""}`,
    };
  }
  return undefined;
});

export const getTerryTaskEditorial = cache(
  async (taskName: string): Promise<Editorial | undefined> => {
    const res = await cmsDb
      .select({
        id: editorials.id,
        type: editorials.type,
        url: editorials.url,
        digest: editorials.digest,
        page: taskEditorials.page,
      })
      .from(taskEditorials)
      .innerJoin(editorials, eq(editorials.id, taskEditorials.editorialId))
      .where(and(eq(taskEditorials.taskName, taskName), eq(taskEditorials.isTerry, true)))
      .limit(1);

    const row = res[0];
    if (!row) return undefined;

    if (row.type === "markdown") {
      return { type: "markdown" };
    }
    if (row.type === "pdf_url") {
      return {
        type: "pdf",
        url: `/files/editorial-pdf/terry/${taskName}${row.page ? `#page=${row.page}` : ""}`,
      };
    }
    if (row.type === "pdf_file") {
      return {
        type: "pdf",
        url: `/files/${row.digest}/editorial.pdf${row.page ? `#page=${row.page}` : ""}`,
      };
    }
    return undefined;
  },
);

export type EditorialAccess =
  | {
      hasEditorial: false;
    }
  | {
      hasEditorial: true;
      canView: false;
      reason: "not_logged_in" | "no_submissions" | "zero_score" | "cooldown";
      daysRemaining?: number;
    }
  | {
      hasEditorial: true;
      canView: true;
      isFullySolved: boolean;
      editorial: Editorial;
    };

export const checkCanViewEditorial = cache(
  async (taskName: string, cmsId?: number | null): Promise<EditorialAccess> => {
    const editorial = await getTaskEditorial(taskName);
    if (!editorial) return { hasEditorial: false };

    if (!cmsId) {
      return { hasEditorial: true, canView: false, reason: "not_logged_in" };
    }

    const submissions = await getTaskSubmissions(taskName, cmsId);
    if (submissions.length === 0) {
      return { hasEditorial: true, canView: false, reason: "no_submissions" };
    }

    const isFullySolved = submissions.some((sub) => sub.score !== null && sub.score >= 100);
    if (isFullySolved) {
      return { hasEditorial: true, canView: true, isFullySolved: true, editorial };
    }

    const hasPositiveScore = submissions.some((sub) => sub.score !== null && sub.score > 0);
    if (!hasPositiveScore) {
      return { hasEditorial: true, canView: false, reason: "zero_score" };
    }

    const latest = submissions[0];
    const daysSince = differenceInDays(new Date(), new Date(latest.timestamp));
    if (daysSince < 7) {
      return {
        hasEditorial: true,
        canView: false,
        reason: "cooldown",
        daysRemaining: 7 - daysSince,
      };
    }

    return { hasEditorial: true, canView: true, isFullySolved: false, editorial };
  },
);

export const checkCanViewTerryEditorial = cache(
  async (taskName: string, username?: string | null): Promise<EditorialAccess> => {
    const editorial = await getTerryTaskEditorial(taskName);
    if (!editorial) return { hasEditorial: false };

    if (!username) {
      return { hasEditorial: true, canView: false, reason: "not_logged_in" };
    }

    const submissions = await getTerrySubmissions(taskName, username);
    if (submissions.length === 0) {
      return { hasEditorial: true, canView: false, reason: "no_submissions" };
    }

    const isFullySolved = submissions.some((sub) => sub.score >= sub.maxScore);
    if (isFullySolved) {
      return { hasEditorial: true, canView: true, isFullySolved: true, editorial };
    }

    const hasPositiveScore = submissions.some((sub) => sub.score > 0);
    if (!hasPositiveScore) {
      return { hasEditorial: true, canView: false, reason: "zero_score" };
    }

    const latest = submissions[0];
    const daysSince = differenceInDays(new Date(), new Date(latest.date));
    if (daysSince < 7) {
      return {
        hasEditorial: true,
        canView: false,
        reason: "cooldown",
        daysRemaining: 7 - daysSince,
      };
    }

    return { hasEditorial: true, canView: true, isFullySolved: false, editorial };
  },
);

export const getEditorialMarkdown = cache(
  async (taskName: string, isTerry = false): Promise<string | undefined> => {
    const res = await cmsDb
      .select({
        content: editorials.content,
      })
      .from(taskEditorials)
      .innerJoin(editorials, eq(editorials.id, taskEditorials.editorialId))
      .where(
        and(
          eq(taskEditorials.taskName, taskName),
          eq(taskEditorials.isTerry, isTerry),
          eq(editorials.type, "markdown"),
        ),
      )
      .limit(1);

    return res[0]?.content ?? undefined;
  },
);

export const getEditorialPdfUrl = cache(
  async (taskName: string, isTerry = false): Promise<string | undefined> => {
    const res = await cmsDb
      .select({
        url: editorials.url,
      })
      .from(taskEditorials)
      .innerJoin(editorials, eq(editorials.id, taskEditorials.editorialId))
      .where(
        and(
          eq(taskEditorials.taskName, taskName),
          eq(taskEditorials.isTerry, isTerry),
          eq(editorials.type, "pdf_url"),
        ),
      )
      .limit(1);

    return res[0]?.url ?? undefined;
  },
);
