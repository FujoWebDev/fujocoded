const encodedData = {
  "@context": "https://w3id.org/openbadges/v2",
  type: "CryptographicKey",
  id: "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/publicKey.json",
  owner:
    "https://fujocoded-git-open-badge-fujowebdev.vercel.app/open-badges/issuer.json",
  publicKeyPem:
    "-----BEGIN PUBLIC KEY-----\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDX5FGhBULGZ7i9fytUY6MIYjh8AU+Z09+9w91wb7Oi2yG0EsDrGvCPg4IUWXitUU4RG7MSvyF+SJKM5YEcidEUJ9O+YWlwubXFBZo4xZlxfb06tTMti6dOo0jwEqqCmXQeas6jsxJ8JT9/K0UDUxTSj06wzcRZdWbNW5eenwXUCZWo1p743uBJgg9IsdKapv4tUtNqS6czYfTHRwTRR91L9GfmO1/sUiUTa50GWK4nMEyYZKF3VgW6VT3BvGZn53Vr2vW7iBRJ7ZicHSu+/Nj8CB+oeZ3b70Xf/kIpLxmi8EFNR19kv57B3+s+L3c6DFEJmDjWmJy9diP+Vly1rYvnkl6Re4DCHhlhW/Y2xNiiYo3ZnaZxCt7lonGqM5AMTya3tNJr/y2mtZbrucf59ZEbak3oEu2b4unru2P5LwgAE3LkNPvj9oEzPUmP5PKmQhkz87IuM5SbyRu6O9yQ/NZiuduF9pC7hwVDjqQ0iDRQt4MM1F6XOG7YvRcBkmzR1DM=\n-----END PUBLIC KEY-----\n",
};
export async function GET() {
  return new Response(JSON.stringify(encodedData), {
    headers: { "Content-Type": "application/ld+json;charset=UTF-8" },
  });
}
