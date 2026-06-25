const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelUrl ? `https://${vercelUrl}` : "https://rodrigocohen.com.br");
