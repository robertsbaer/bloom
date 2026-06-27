// @ts-nocheck — This file runs on Deno (Supabase Edge Runtime).
// Deno provides its own types at runtime; the editor's TS server uses Node typings.
// Send an email via Resend. Required secrets:
//   RESEND_API_KEY

import { Resend } from "https://esm.sh/resend@3.2.0";
import { corsHeaders } from "./cors.ts";
import * as template from "./template.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

Deno.serve(async (req) => {
  console.log("New request received");
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    console.log(`Invalid method: ${req.method}`);
    return json({ error: "Method not allowed" }, 405, origin);
  }

  let body: { [key: string]: any };
  try {
    body = await req.json();
    console.log("Request body parsed:", JSON.stringify(body, null, 2));
  } catch (e) {
    console.error("Invalid JSON:", e);
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  console.log(`Processing request type: ${body.type || "order"}`);

  const from = "admin@mybloom55.com";

  // Case 1: Order confirmation email
  if (body.orderId) {
    const { to, name, orderId, total, items, shippingAddress } = body;
    if (!to || !name || !orderId || !total || !items || !shippingAddress) {
      return json(
        { error: "Missing required fields for order email" },
        400,
        origin,
      );
    }
    try {
      await resend.emails.send({
        from,
        to,
        subject: `Your Bloom 5.5 order #${orderId.slice(0, 8)} is confirmed`,
        html: template.html({ orderId, name, total, items, shippingAddress }),
      });
    } catch (err) {
      console.error("Resend error:", err);
      return json(
        { error: "Failed to send order email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Case 2: Wholesale inquiry
  else if (body.businessName) {
    const {
      to,
      businessName,
      contactName,
      email,
      phone,
      businessType,
      state,
      notes,
      items,
    } = body;
    if (!to || !businessName || !contactName || !email) {
      return json(
        { error: "Missing required fields for wholesale email" },
        400,
        origin,
      );
    }
    try {
      // Send email to admin
      await resend.emails.send({
        from,
        to: "orders@mybloom55.com",
        subject: `New wholesale inquiry from ${businessName}`,
        html: template.wholesaleInquiryAdminHtml({ ...body, to: undefined }),
      });

      // Send confirmation email to user
      await resend.emails.send({
        from,
        to: email,
        subject: "Your Bloom 5.5 wholesale inquiry has been received",
        html: template.wholesaleInquiryConfirmationHtml({ name: contactName }),
      });
    } catch (err) {
      console.error("Resend error:", err);
      return json(
        { error: "Failed to send wholesale email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Case 3: Newsletter signup email
  else if (body.type === "newsletter") {
    const { email } = body;
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "Welcome to Bloom 5.5! Here’s your 10% off code",
        html: template.newsletterHtml(),
      });
    } catch (err) {
      console.error("Resend error:", err);
      return json(
        { error: "Failed to send newsletter email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Case 4: New Account email
  else if (body.type === "new-account") {
    const { email, name } = body;
    if (!email || !name) {
      return json(
        { error: "Missing required fields for new account email" },
        400,
        origin,
      );
    }
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "Welcome to Bloom 5.5!",
        html: template.newAccountHtml({ name }),
      });
    } catch (err) {
      console.error("Resend error:", err);
      return json(
        { error: "Failed to send new account email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Case 5: Password Reset email
  else if (body.type === "password-reset") {
    const { email, name, link } = body;
    if (!email || !name || !link) {
      return json(
        { error: "Missing required fields for password reset email" },
        400,
        origin,
      );
    }
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "Reset your Bloom 5.5 Password",
        html: template.passwordResetHtml({ name, link }),
      });
    } catch (err) {
      console.error("Resend error:", err);
      return json(
        { error: "Failed to send password reset email", detail: err.message },
        500,
        origin,
      );
    }
  }
  // Default case: invalid request body
  else {
    return json({ error: "Invalid request body" }, 400, origin);
  }

  return json({ ok: true }, 200, origin);
});
