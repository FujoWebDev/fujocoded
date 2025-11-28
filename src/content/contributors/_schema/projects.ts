export const PROJECTS = [
  "Volume 0 Kickstarter",
  "Volume 0",
  // TODO: rename to "Websites"
  // TODO: must be changed for all relevant team member .yaml files
  // TODO: fujoweb.dev, fujocoded.com, etc. as sub-parts
  "Websites",
  "Volume 0 Issue 1",
  "Fandom Cookies",
  "FujoCoded",
] as const;
export type Project = typeof PROJECTS[number];

export const VOLUME_0_ISSUE_1_ROLES = [
  "Technical Writer",
  "Scenario Writer",
  "Beta Reading Coordinator",
  "Beta Reader",
  "Proofreader",
  "Artist",
  "Tasks Coordinator",
  "Communications",
  "Character Designer",
  "Additional Coding",
  "Data Collection & Entry",
];

export const WEBSITES_ROLES = [
  "fujoweb.dev",
  "fujocoded.com",
];

export const FUJOCODED_ROLES = [
  "HimeOps",
  "FujoCoded",
];

export const FANDOM_COOKIES_ROLES = [
  "Artist",
  "Extra",
  "Alt Text",
  "Programming",
  "Digital Item Pack Assembly",
  "Additional Research, Feedback, Development, and Assistance",
  "Digital Item Pack Wallpapers",
  "Extra Hands (and Brains)",
  "CSS & Design",
  "Art Direction",
  "Cookie Catcher Design",
  "Feedback",  
];

export const PROJECT_ROLES : Record<Project, string[]> = {
  "Volume 0 Issue 1": VOLUME_0_ISSUE_1_ROLES,
  "Volume 0 Kickstarter": [],
  "Volume 0": [],
  "Websites": WEBSITES_ROLES,
  "Fandom Cookies": FANDOM_COOKIES_ROLES,
  "FujoCoded": FUJOCODED_ROLES,
};

export default PROJECTS;
