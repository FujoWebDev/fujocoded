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
      "sha256$be623547771d96c7232770570d8de894f26c3e9938acdc2b49252b018064ac05",
    salt: "ab01f2bfe4a14832956a91ef8cacf064",
  },
  issuedOn: new Date(Date.now()).toISOString(),
  verification: {
    type: "hosted",
  },
  badge: {
    type: "BadgeClass",
    id: "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/badges/seed-campaign.json",
    name: "FujoCoded LLC Seed Campaign",
    description: "This person donated to the FujoCoded LLC Seed Campaign",
    image:
      "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/badges/seed-campaign/image",
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
