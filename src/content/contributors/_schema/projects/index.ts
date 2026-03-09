import {
  VOLUME_0_KICKSTARTER_ROLES,
  VOLUME_0_ROLES,
  VOLUME_0_ISSUE_1_ROLES,
  WEBSITES_ROLES,
} from "./fujoguide";

import { FANDOM_COOKIES_ROLES } from "./fandom-cookies";

export {
  VOLUME_0_KICKSTARTER_ROLES,
  VOLUME_0_ROLES,
  VOLUME_0_ISSUE_1_ROLES,
  WEBSITES_ROLES,
} from "./fujoguide";

export { FANDOM_COOKIES_ROLES } from "./fandom-cookies";

export const FUJOCODED_ROLES = ["HimeOps", "FujoCoded", "Project Manager"];
export const LEARN_AT_ROLES = ["Article Writer", "Writers Coordinator"];
export const CODE_CONTRIBUTOR_ROLES = ["Documentation", "Maintainer"];

export const PROJECTS = [
  "Volume 0 Kickstarter",
  "Volume 0",
  "Volume 0 Issue 1",
  "Websites",
  "Fandom Cookies",
  "FujoCoded",
  "Learn@",
  "Code Contributor",
] as const;
export type Project = (typeof PROJECTS)[number];

export const PROJECT_ROLES: Record<Project, string[]> = {
  "Volume 0 Kickstarter": VOLUME_0_KICKSTARTER_ROLES,
  "Volume 0": VOLUME_0_ROLES,
  "Volume 0 Issue 1": VOLUME_0_ISSUE_1_ROLES,
  Websites: WEBSITES_ROLES,
  "Fandom Cookies": FANDOM_COOKIES_ROLES,
  FujoCoded: FUJOCODED_ROLES,
  "Learn@": LEARN_AT_ROLES,
  "Code Contributor": CODE_CONTRIBUTOR_ROLES,
};

export default PROJECTS;
