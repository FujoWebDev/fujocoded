import { z } from "astro:content";
import { type ProfileMatch, SocialLinks } from "social-links";
import "@total-typescript/ts-reset/array-includes";

export const socialsSchema = z.union([
  z.string().url(),
  z.object({
    icon: z.string().optional(),
    platform: z.string().optional(),
    url: z.string().url(),
  }),
]);
export type SocialsSchema = z.infer<typeof socialsSchema>;

export type SocialsData = {
  icon: string | null;
  url: string;
  username: string | null;
  platform: WEBSITE_TYPES;
};

export const SOCIAL_HOSTS = [
  "github",
  "tumblr",
  "twitter",
  "npm",
  "web",
  "bsky",
  "twitch",
  "mastodon",
  "dreamwidth",
  "ko-fi",
  "patreon",
  "youtube",
  "kickstarter",
  "inprnt",
] as const;

export type WEBSITE_TYPES = (typeof SOCIAL_HOSTS)[number];

export const transformSocial = (social: SocialsSchema) => {
  if (typeof social == "string") {
    return extractSocialData({ url: social });
  }
  const { icon, url, platform } = social;
  const data = extractSocialData({ url });

  return {
    ...data,
    icon:
      icon || platform === undefined || !SOCIAL_HOSTS.includes(platform)
        ? data.icon
        : getSocialIcon(platform as WEBSITE_TYPES),
    url,
    platform,
  };
};

const socialLinks = new SocialLinks();
const tumblrMatches: ProfileMatch[] = [
  {
    match: "https?://([a-z0-9-]+).tumblr.com",
    // TODO: more may be necessary for things like extracting usernames
    group: 1,
  },
];
socialLinks.addProfile("tumblr", tumblrMatches);
const kofiMatches: ProfileMatch[] = [
  {
    match: "https?://ko-fi.com/([a-z0-9-]+)",
    group: 1,
  },
];
socialLinks.addProfile("ko-fi", kofiMatches);

const inprntMatches: ProfileMatch[] = [
  {
    match: "https?://(?:www.)?inprnt.com/gallery/([a-z0-9-]+)/?",
    group: 1,
  },
];
socialLinks.addProfile("inprnt", inprntMatches);

const getSocialIcon = (platform: WEBSITE_TYPES) => {
  if (platform === "inprnt") {
    return "lucide:shopping-bag";
  }
  if (platform === "bsky") {
    return "simple-icons:bluesky";
  }
  return "simple-icons:" + platform.replaceAll("-", "");
};

export const extractSocialData = ({ url }: { url: string }): SocialsData => {
  const socialLinkAttempt = socialLinks.detectProfile(url);
  if (socialLinkAttempt) {
    return {
      url,
      platform: socialLinkAttempt as WEBSITE_TYPES,
      username: socialLinks.getProfileId(socialLinkAttempt, url),
      icon: getSocialIcon(socialLinkAttempt as WEBSITE_TYPES),
    };
  }
  const { host } = new URL(url);
  let hostName = host
    .substring(host.startsWith("www.") ? 4 : 0, host.lastIndexOf("."))
    .toLowerCase();

  if (hostName == "x") {
    hostName = "twitter";
  }

  if (SOCIAL_HOSTS.includes(hostName)) {
    return {
      url,
      platform: hostName as WEBSITE_TYPES,
      username: null,
      icon: getSocialIcon(hostName as WEBSITE_TYPES),
    };
  }
  // If you cannot find it, return the original url
  return { url, platform: "web", username: null, icon: null };
};
