import { z } from "astro:content";
import { type ProfileMatch, SocialLinks } from "social-links";

export const socialsSchema = z.union([
  z.string().url(),
  z.object({
    icon: z.string().optional(),
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

export type WEBSITE_TYPES =
  | "github"
  | "tumblr"
  | "twitter"
  | "npm"
  | "web"
  | "bsky"
  | "twitch"
  | "mastodon"
  | "dreamwidth"
  | "ko-fi"
  | "patreon"
  | "youtube"
  | "kickstarter"
  | "inprnt";

export const transformSocial = (social: SocialsSchema) => {
  if (typeof social == "string") {
    return extractSocialData({ url: social });
  }
  const { icon, url } = social;
  const data = extractSocialData({ url });

  return {
    ...data,
    icon,
    url,
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
    return null;
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
  // If you cannot find it, return the original url
  return { url, platform: "web", username: null, icon: null };
};
