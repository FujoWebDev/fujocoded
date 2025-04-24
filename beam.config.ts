export default {
  contentPaths: [
    {
      root: "./src/content/updates/",
      glob: "**/_socials/**.md",
    },
    {
      root: "./src/content/updates/",
      glob: "*/_*.md",
      platformRegex: /_(.*)\.md$/,
    },
  ],
  users: [
    {
      shorthand: "fujocoded",
      name: "FujoCoded",
      socials: {
        mastodon: "fujocoded@blorbo.social",
        bsky: "fujocoded.bsky.social",
        tumblr: "fujocoded",
        twitter: "fujoc0ded",
        buttondown: "fujocoded",
        backerkit:
          "essential.randomn3ss@gmail.com/fujocoded-software-and-education-for-a-better-web",
        kickstarter:
          "essential-randomness/the-fujoshi-guide-to-web-development",
      },
    },
  ],
};
