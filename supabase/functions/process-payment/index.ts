// @ts-nocheck — This file runs on Deno (Supabase Edge Runtime).
// Deno provides its own types at runtime; the editor's TS server uses Node typings.
// Square payment processing Edge Function
// Deploy: supabase functions deploy process-payment --no-verify-jwt
//
// Required secrets (set via `supabase secrets set ...`):
//   SQUARE_ACCESS_TOKEN   - server-side Square API token
//   SQUARE_ENVIRONMENT    - 'sandbox' or 'production'
//   SQUARE_LOCATION_ID    - your Square location ID
//
// Auto-injected by Supabase:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

// CORS — allow the static GitHub Pages site + local dev
const ALLOWED_ORIGINS = [
  "https://robertsbaer.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://mybloom55.com",
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

interface IncomingItem {
  productId: number;
  sizeLabel: string;
  quantity: number;
}

interface IncomingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

interface PaymentRequest {
  sourceId: string; // tokenized card from Web Payments SDK
  idempotencyKey: string; // client-generated UUID — required by Square
  email: string;
  phone?: string;
  shipping: IncomingAddress;
  billing: IncomingAddress;
  items: IncomingItem[];
}

// ─────────────────────────────────────────────────────────────────────────
// Authoritative product price catalog. We DO NOT trust client prices.
// Keep this in sync with src/data.ts pricing.
// ─────────────────────────────────────────────────────────────────────────
const CATALOG: Record<number, Record<string, number>> = {
  // id: { sizeLabel: priceCents }
  100: { Set: 7200 }, // Women's Summer Set
  101: { Set: 6300 }, // Men's Summer Set
  10: { "4 fl oz": 2200, "8 fl oz": 3500 }, // Desert Bloom Body Butter
  3: { "2 oz": 2000 }, // Desert Sage Beard Balm
  4: { "1 fl oz": 1500 }, // Desert Sage Beard Oil
  5: { "0.13 oz tube": 799 }, // Desert Veil Lip Balm
  6: { "1 fl oz Airless Pump": 2500 }, // Midnight Bloom Serum
  7: { "1 fl oz Airless Pump": 2000 }, // Radiance Facial Moisturizer
  8: { "1 fl oz Airless Pump": 2000 }, // Radiance Lite Facial Moisturizer
};

const PRODUCT_NAMES: Record<number, string> = {
  100: "Bloom 5.5 Women's Summer Set",
  101: "Bloom 5.5 Men's Summer Set",
  10: "Bloom 5.5 Desert Bloom Body Butter",
  3: "Bloom 5.5 Desert Sage Beard Balm",
  4: "Bloom 5.5 Desert Sage Beard Oil",
  5: "Bloom 5.5 Desert Veil Lip Balm",
  6: "Bloom 5.5 Midnight Bloom Serum",
  7: "Bloom 5.5 Radiance Facial Moisturizer",
  8: "Bloom 5.5 Radiance Lite Facial Moisturizer",
};

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

  // ── Parse + validate ────────────────────────────────────────────────
  let body: PaymentRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const { sourceId, idempotencyKey, email, phone, shipping, billing, items } =
    body ?? {};
  if (
    !sourceId ||
    !idempotencyKey ||
    !email ||
    !shipping ||
    !billing ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return json({ error: "Missing required fields" }, 400, origin);
  }

  // ── Recompute totals from server catalog (never trust the client) ───
  let subtotalCents = 0;
  const lineItems: Array<{
    product_id: number;
    product_name: string;
    size_label: string;
    unit_price_cents: number;
    quantity: number;
    line_total_cents: number;
  }> = [];

  for (const it of items) {
    const productPrices = CATALOG[it.productId];
    if (!productPrices)
      return json({ error: `Unknown product: ${it.productId}` }, 400, origin);
    const unit = productPrices[it.sizeLabel];
    if (unit == null)
      return json(
        { error: `Invalid size for product ${it.productId}: ${it.sizeLabel}` },
        400,
        origin,
      );
    if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 50) {
      return json(
        { error: `Invalid quantity for product ${it.productId}` },
        400,
        origin,
      );
    }
    const lineTotal = unit * it.quantity;
    subtotalCents += lineTotal;
    lineItems.push({
      product_id: it.productId,
      product_name: PRODUCT_NAMES[it.productId] ?? `Product #${it.productId}`,
      size_label: it.sizeLabel,
      unit_price_cents: unit,
      quantity: it.quantity,
      line_total_cents: lineTotal,
    });
  }

  if (subtotalCents <= 0) return json({ error: "Empty cart" }, 400, origin);

  // ── Supabase admin client (service role, bypasses RLS) ──────────────
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ── First-purchase 10% discount logic ───────────────────────────────
  // A customer counts as "first purchase" when no PAID order exists for
  // that email yet.
  const normalizedEmail = email.trim().toLowerCase();
  const { count: paidCount, error: countErr } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "paid")
    .ilike("email", normalizedEmail);

  if (countErr) {
    return json(
      { error: "Database error", detail: countErr.message },
      500,
      origin,
    );
  }

  const isFirstPurchase = (paidCount ?? 0) === 0;
  const discountCents = isFirstPurchase ? Math.round(subtotalCents * 0.1) : 0;
  const totalCents = subtotalCents - discountCents;

  // ── Insert pending order ────────────────────────────────────────────
  const { data: orderRow, error: insertErr } = await supabase
    .from("orders")
    .insert({
      email: normalizedEmail,
      phone: phone ?? null,
      ship_name: shipping.name,
      ship_address1: shipping.address1,
      ship_address2: shipping.address2 ?? null,
      ship_city: shipping.city,
      ship_state: shipping.state,
      ship_postal_code: shipping.postalCode,
      ship_country: shipping.country ?? "US",
      bill_name: billing.name,
      bill_address1: billing.address1,
      bill_address2: billing.address2 ?? null,
      bill_city: billing.city,
      bill_state: billing.state,
      bill_postal_code: billing.postalCode,
      bill_country: billing.country ?? "US",
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      is_first_purchase: isFirstPurchase,
      discount_code: isFirstPurchase ? "FIRST10" : null,
      status: "pending",
    })
    .select()
    .single();

  if (insertErr || !orderRow) {
    return json(
      { error: "Could not create order", detail: insertErr?.message },
      500,
      origin,
    );
  }

  const itemsToInsert = lineItems.map((li) => ({
    order_id: orderRow.id,
    ...li,
  }));
  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(itemsToInsert);
  if (itemsErr) {
    await supabase
      .from("orders")
      .update({ status: "failed", failure_reason: itemsErr.message })
      .eq("id", orderRow.id);
    return json(
      { error: "Could not save line items", detail: itemsErr.message },
      500,
      origin,
    );
  }

  // ── Charge card via Square ──────────────────────────────────────────
  const squareEnv = (
    Deno.env.get("SQUARE_ENVIRONMENT") ?? "sandbox"
  ).toLowerCase();
  const squareBase =
    squareEnv === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";
  const squareToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
  const squareLocation = Deno.env.get("SQUARE_LOCATION_ID");

  if (!squareToken || !squareLocation) {
    await supabase
      .from("orders")
      .update({ status: "failed", failure_reason: "Missing Square config" })
      .eq("id", orderRow.id);
    return json({ error: "Server not configured for payments" }, 500, origin);
  }

  const squareResponse = await fetch(`${squareBase}/v2/payments`, {
    method: "POST",
    headers: {
      "Square-Version": "2024-10-17",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      amount_money: { amount: totalCents, currency: "USD" },
      location_id: squareLocation,
      buyer_email_address: normalizedEmail,
      shipping_address: {
        first_name: shipping.name.split(" ")[0],
        last_name: shipping.name.split(" ").slice(1).join(" ") || shipping.name,
        address_line_1: shipping.address1,
        address_line_2: shipping.address2 ?? "",
        locality: shipping.city,
        administrative_district_level_1: shipping.state,
        postal_code: shipping.postalCode,
        country: shipping.country ?? "US",
      },
      billing_address: {
        first_name: billing.name.split(" ")[0],
        last_name: billing.name.split(" ").slice(1).join(" ") || billing.name,
        address_line_1: billing.address1,
        address_line_2: billing.address2 ?? "",
        locality: billing.city,
        administrative_district_level_1: billing.state,
        postal_code: billing.postalCode,
        country: billing.country ?? "US",
      },
      reference_id: orderRow.id,
      note: `Bloom 5.5 order ${orderRow.id.slice(0, 8)}`,
    }),
  });

  const squareData = await squareResponse.json();

  if (!squareResponse.ok || !squareData.payment) {
    const reason =
      squareData?.errors?.[0]?.detail ??
      squareData?.errors?.[0]?.code ??
      "Payment declined";
    await supabase
      .from("orders")
      .update({ status: "failed", failure_reason: reason })
      .eq("id", orderRow.id);
    return json({ error: reason, errors: squareData?.errors }, 402, origin);
  }

  const payment = squareData.payment;

  await supabase
    .from("orders")
    .update({
      status: "paid",
      square_payment_id: payment.id,
      square_order_id: payment.order_id ?? null,
      square_receipt_url: payment.receipt_url ?? null,
    })
    .eq("id", orderRow.id);

  // ── Find user and link to order if they exist ───────────────────
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers({
      email: normalizedEmail,
    });

  let newUser = true;
  if (listError) {
    console.error(
      `Could not list users to find existing user: ${listError.message}`,
    );
  } else if (existingUsers?.users?.[0]) {
    const userId = existingUsers.users[0].id;
    newUser = false;
    const { error: updateError } = await supabase
      .from("orders")
      .update({ user_id: userId })
      .eq("id", orderRow.id);
    if (updateError) {
      console.error(
        `Failed to link order ${orderRow.id} to user ${userId}: ${updateError.message}`,
      );
    }
  }

  return json(
    {
      orderId: orderRow.id,
      status: "paid",
      isFirstPurchase,
      discountCents,
      subtotalCents,
      totalCents,
      receiptUrl: payment.receipt_url ?? null,
      newUser,
    },
    200,
    origin,
  );
});
