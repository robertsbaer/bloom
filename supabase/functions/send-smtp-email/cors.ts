const ALLOWED_ORIGINS = [
  "https://robertsbaer.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://mybloom55.com",
];

export function corsHeaders(origin: string | null) {
  const allow =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}
