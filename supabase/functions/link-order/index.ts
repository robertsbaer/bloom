import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const ALLOWED_ORIGINS = [
  "https://robertsbaer.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://mybloom55.com",
];

function corsHeaders(origin: string | null) {
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

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  const { orderId, userId } = await req.json();
  if (!orderId || !userId) {
    return json({ error: "Missing orderId or userId" }, 400, origin);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { error: updateError } = await supabase
    .from("orders")
    .update({ user_id: userId })
    .eq("id", orderId);

  if (updateError) {
    return json(
      { error: `Failed to link order: ${updateError.message}` },
      500,
      origin,
    );
  }

  return json({ success: true }, 200, origin);
});
