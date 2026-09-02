// ────────────────────────────────────────────────────────────
// DO NOT EDIT — synced from FujoWebDev/contributors @ 305b05cffbce
// Source: contributors/_schema/index.ts
// Refresh: pnpm sync
// ────────────────────────────────────────────────────────────
import { z } from "astro/zod";
import type { SchemaContext } from "astro:content";
import { CHIPS, type Chip } from "./chips.ts";
import { PROJECT_ROLES, PROJECTS, type Project } from "./projects/index.ts";
import { SocialLinks } from "./socials.ts";

export { CHIPS, type Chip } from "./chips.ts";
export { PROJECTS, type Project } from "./projects/index.ts";

export type ContributorSchemaContext<AvatarSchema extends z.ZodTypeAny> = {
  image: () => AvatarSchema;
};

type RoleOutput = {
  project: Project;
  name: string;
  details?: string;
  chips: readonly Chip[];
};

// function isNonEmpty<Value>(values: Value[]): values is [Value, ...Value[]] {
//   return values.length > 0;
// }

const RoleFor = (project: Project) => {
  const roleMap = PROJECT_ROLES[project];
  const names = Object.keys(roleMap);
  // const NameSchema = isNonEmpty(names) ? z.enum(names) : z.string();
  const NameSchema = names.length > 0 ? z.enum(names) : z.string();

  return z
    .union([
      NameSchema,
      z.object({
        role: NameSchema,
        details: z.string(),
      }),
    ])
    .transform((value): RoleOutput => {
      const name = typeof value === "string" ? value : value.role;
      const details = typeof value === "string" ? undefined : value.details;
      const chips = roleMap?.[name] ?? [];
      return { project, name, details, chips };
    });
};

const Roles = z
  .object(
    Object.fromEntries(
      PROJECTS.map((project) => [
        project,
        RoleFor(project).array().default([]),
      ]),
    ),
  )
  .strict();

const TYPE = z.enum(["founder", "contractor", "community"]);

export const createContributorSchema = <AvatarSchema extends z.ZodTypeAny>({
  image,
}: ContributorSchemaContext<AvatarSchema>) => {
  const schema = z.object({
    name: z.string(),
    aliases: z
      .string()
      .trim()
      .min(1)
      .array()
      .default([])
      .transform((aliases) => [...new Set(aliases)]),
    avatar: image(),
    type: z
      .union([TYPE, TYPE.array()])
      .transform((types) => (Array.isArray(types) ? types : [types])),
    roles: Roles,
    chips: z.enum(CHIPS).array().default([]),
    contacts: SocialLinks,
  });

  return schema.transform(({ roles, chips, ...contributor }) => {
    const roleChips = Object.values(roles).flatMap((projectRoles) =>
      projectRoles.flatMap((role) => role.chips),
    );

    return {
      ...contributor,
      roles,
      chips: [...new Set([...chips, ...roleChips])],
    };
  });
};

export const ContributorSchema = ({ image }: SchemaContext) =>
  createContributorSchema({ image });
