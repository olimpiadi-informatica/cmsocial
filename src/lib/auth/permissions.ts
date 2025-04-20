import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  tag: ["add", "remove-own", "remove-any"],
  task: ["submit"],
} as const;

export type Statements = typeof statements;

export const ac = createAccessControl(statements);

const newbie = ac.newRole({
  ...userAc.statements,
  task: ["submit"],
});

const trusted = ac.newRole({
  ...userAc.statements,
  tag: ["add", "remove-own"],
  task: ["submit"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  tag: ["add", "remove-own", "remove-any"],
  task: ["submit"],
});

export const roles = { newbie, trusted, admin };
