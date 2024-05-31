const encodedData = {
  type: "BadgeClass",
  id: "https://fujocoded.com/open-badges/badges/seed-campaign/badge.json",
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
      allowedOrigins: "fujocoded-git-open-badge-fujowebdev.vercel.app",
    },
  },
};

export async function GET() {
  return new Response(JSON.stringify(encodedData), {
    headers: { "Content-Type": "application/ld+json;charset=UTF-8" },
  });
}
