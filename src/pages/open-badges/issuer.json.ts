const encodedData = {
  id: "https://fujocoded.com/",
  type: "Profile",
  name: "FujoCoded LLC",
  url: "https://fujocoded.com/",
  email: "contacts@fujocoded.com",
  publicKey:
    "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/publicKey.json",
  verification: {
    allowedOrigins: "fujocoded-git-open-badge-fujowebdev.vercel.app",
  },
};

export async function GET() {
  return new Response(JSON.stringify(encodedData), {
    headers: { "Content-Type": "application/ld+json;charset=UTF-8" },
  });
}
