import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

import type { User } from "@olinfo/training-api";
import { Badge, type CategoryBadge, type CategoryId } from "~/lib/algobadge";

export enum BadgeExtra {
  Loading = 100,
  Invalid = 101,
}

export type ExtendedBadge = Badge | BadgeExtra;

export type UserBadge = {
  username: string;
  user?: User;
  badges: Record<CategoryId, CategoryBadge>;
  totalBadge: ExtendedBadge;
};

export type UserBadges = Record<string, UserBadge>;

export const badgeTypes: ExtendedBadge[] = [
  Badge.None,
  Badge.Honorable,
  Badge.Bronze,
  Badge.Silver,
  Badge.Gold,
  Badge.Diamond,
  BadgeExtra.Loading,
  BadgeExtra.Invalid,
];

export const badgeColor: Record<ExtendedBadge, string> = {
  [Badge.Diamond]: "#22d3ee",
  [Badge.Gold]: "#fbbf24",
  [Badge.Silver]: "#9ca3af",
  [Badge.Bronze]: "#d97706",
  [Badge.Honorable]: "#22c55e",
  [Badge.None]: "#374151",
  [Badge.Locked]: "#f87171",
  [BadgeExtra.Invalid]: "#f87171",
  [BadgeExtra.Loading]: "#1f2937",
};

export const badgeName: Record<ExtendedBadge, MessageDescriptor> = {
  [Badge.Locked]: msg`Bloccato`,
  [Badge.None]: msg`Nessuno`,
  [Badge.Honorable]: msg`Menzione`,
  [Badge.Bronze]: msg`Bronzo`,
  [Badge.Silver]: msg`Argento`,
  [Badge.Gold]: msg`Oro`,
  [Badge.Diamond]: msg`Diamante`,
  [BadgeExtra.Invalid]: msg`Non valido`,
  [BadgeExtra.Loading]: msg`Caricamento`,
};
