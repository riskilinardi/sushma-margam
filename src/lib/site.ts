// Vercel sets this on every deployment; locally it falls back to the dev server.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = productionHost
  ? `https://${productionHost}`
  : "http://localhost:3000";
