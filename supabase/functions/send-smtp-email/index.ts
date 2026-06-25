import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

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

serve(async (req) => {
  console.log("Function invoked");
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  const { email } = await req.json();
  console.log(`Email received: ${email}`);
  if (!email) {
    return json({ error: "Missing email" }, 400, origin);
  }

  try {
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: Deno.env.get("SMTP_HOST")!,
      port: Number(Deno.env.get("SMTP_PORT"))!,
      username: Deno.env.get("SMTP_USER")!,
      password: Deno.env.get("SMTP_PASS")!,
    });

    await client.send({
      from: Deno.env.get("SMTP_FROM_EMAIL")!,
      to: email,
      subject: "Your 10% Discount from Bloom 5.5!",
      html: `
        <h1>Welcome to Bloom 5.5!</h1>
        <p>Thank you for signing up. Use the code <strong>FIRST10</strong> at checkout to receive 10% off your first order.</p>
      `,
    });

    await client.close();

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("Error sending email:", error);
    return json(
      { error: `Failed to send email: ${error.message}` },
      500,
      origin,
    );
  }
});
