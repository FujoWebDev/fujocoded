import { z } from "zod";
import { PROJECT_ROLES, PROJECTS } from "./projects";
import {
  SocialsSchema,
  transformSocial,
} from "@fujocoded/zod-transform-socials";
import type { SchemaContext } from "astro:content";

const Role = <T extends z.ZodEnum<any> | z.ZodString = z.ZodString>(
  roleType: T | z.ZodString = z.string()
) =>
  z.union([
    roleType,
    z.object({
      role: roleType,
      details: z.string(),
    }),
  ]);

const Roles = z
  .object(
    Object.fromEntries(
      PROJECTS.map((project) => [
        project,
        Role(
          PROJECT_ROLES[project]
            ? z.enum(PROJECT_ROLES[project] as [string, ...string[]])
            : z.string()
        )
          .array()
          .default([]),
      ])
    )
  )
  .strict();
  
export const ContributorSchema = ({ image } : SchemaContext) => z.object({
  name: z.string(),
  avatar: image(),
  type: z.enum(["founder", "contractor", "community"]).array(),
  roles: Roles,
  contacts: SocialsSchema.array()
    .default([])
    .transform((contacts) => contacts.map(transformSocial)),
});
