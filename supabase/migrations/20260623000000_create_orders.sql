-- Orders + order items for Bloom 5.5 storefront
-- Created for Square checkout integration

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,

  -- Shipping
  ship_name text NOT NULL,
  ship_address1 text NOT NULL,
  ship_address2 text,
  ship_city text NOT NULL,
  ship_state text NOT NULL,
  ship_postal_code text NOT NULL,
  ship_country text NOT NULL DEFAULT 'US',

  -- Billing
  bill_name text,
  bill_address1 text,
  bill_address2 text,
  bill_city text,
  bill_state text,
  bill_postal_code text,
  bill_country text DEFAULT 'US',

  -- Money (stored in cents to avoid float drift)
  subtotal_cents integer NOT NULL,
  discount_cents integer NOT NULL DEFAULT 0,
  tax_cents integer NOT NULL DEFAULT 0,
  shipping_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL,

  -- Discount tracking
  is_first_purchase boolean NOT NULL DEFAULT false,
  discount_code text,

  -- Square
  square_payment_id text,
  square_receipt_url text,
  square_order_id text,

  -- Lifecycle
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','failed','refunded','canceled')),
  failure_reason text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (lower(email));
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  product_name text NOT NULL,
  size_label text NOT NULL,
  unit_price_cents integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total_cents integer NOT NULL,
  image_url text
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

-- RLS: lock everything down. Edge function uses service-role key
-- (which bypasses RLS). The anon client should never touch orders directly.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_orders_anon"      ON orders      FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_order_items_anon" ON order_items FOR ALL TO anon USING (false) WITH CHECK (false);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
