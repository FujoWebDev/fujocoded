const encodedData = {
  "@context": "https://w3id.org/openbadges/v2",
  //   id: "https://fujocoded.com/open-badges/seed-campaign",
  //   id: "https://api.badgr.io/public/assertions/2sfG9ftoTbu8l6rgHyey0g",
  id: "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/seed-campaign",
  type: "Assertion",
  recipient: {
    type: "email",
    hashed: true,
    identity:
      "sha256$ed452930e18c9916b8beee4aa0e1ae6b87f1a2cd56559ad77badf00309dc5aeb",
    salt: "ab01f2bfe4a14832956a91ef8cacf064",
  },
  issuedOn: new Date(Date.now()).toISOString(),
  verification: {
    type: "hosted",
  },
  badge: {
    type: "BadgeClass",
    id: "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/badges/seed-campaign/badge.json",
    name: "FujoCoded LLC Seed Campaign",
    description: "This person donated to the FujoCoded LLC Seed Campaign",
    image:
      "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/badges/seed-campaign/badge.png",
    criteria: {
      narrative: "this person gave us money",
    },
    issuer: {
      id: "https://fujocoded.com/",
      type: "Profile",
      name: "FujoCoded LLC",
      url: "https://fujocoded.com/",
      email: "contacts@fujocoded.com",
      verification: {
        allowedOrigins: "fujocoded.com",
      },
    },
  },
};

export async function GET() {
  return new Response(JSON.stringify(encodedData), {
    headers: { "Content-Type": "application/ld+json;charset=UTF-8" },
  });
}
