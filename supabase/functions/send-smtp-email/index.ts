// @ts-nocheck — This file runs on Deno (Supabase Edge Runtime).
// Deno provides its own types at runtime; the editor's TS server uses Node typings.
// Send an email via SMTP. Required secrets:
//   SMTP_HOST
//   SMTP_PORT
//   SMTP_USER
//   SMTP_PASS
//   SMTP_FROM

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { corsHeaders } from "./cors.ts";
import * as template from "./template.ts";

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

  let body: { [key: string]: any };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const client = new SMTPClient({
    connection: {
      hostname: Deno.env.get("SMTP_HOST")!,
      port: parseInt(Deno.env.get("SMTP_PORT")!, 10),
      tls: true,
      auth: {
        username: Deno.env.get("SMTP_USER")!,
        password: Deno.env.get("SMTP_PASS")!,
      },
    },
  });

  // Case 1: Order confirmation email
  if (body.orderId) {
    const { to, name, orderId, total, items, shippingAddress } = body;
    if (!to || !name || !orderId || !total || !items || !shippingAddress) {
      return json({ error: "Missing required fields for order email" }, 400, origin);
    }
    try {
      await client.send({
        from: Deno.env.get("SMTP_FROM")!,
        to,
        subject: `Your Bloom 5.5 order #${orderId.slice(0, 8)} is confirmed`,
        content: template.text({ orderId, name, total, items, shippingAddress }),
        html: template.html({ orderId, name, total, items, shippingAddress }),
      });
    } catch (err) {
      return json(
        { error: "Failed to send order email", detail: err.message },
        500,
        origin,
      );
    }
  } 
  // Case 2: Newsletter signup email
  else if (body.email) {
    const { email } = body;
    try {
      await client.send({
        from: Deno.env.get("SMTP_FROM")!,
        to: email,
        subject: "Welcome to Bloom 5.5! Here’s your 10% off code",
        content: template.newsletterText(),
        html: template.newsletterHtml(),
      });
    } catch (err) {
      return json(
        { error: "Failed to send newsletter email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Default case: invalid request body
  else {
    return json({ error: "Invalid request body" }, 400, origin);
  }

  await client.close();
  return json({ ok: true }, 200, origin);
});
