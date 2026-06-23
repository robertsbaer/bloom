
CREATE TABLE wholesale_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_type text,
  state text,
  items jsonb NOT NULL DEFAULT '[]',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wholesale_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_wholesale_inquiries" ON wholesale_inquiries FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "select_wholesale_inquiries" ON wholesale_inquiries FOR SELECT
  TO anon USING (false);

CREATE POLICY "update_wholesale_inquiries" ON wholesale_inquiries FOR UPDATE
  TO anon USING (false) WITH CHECK (false);

CREATE POLICY "delete_wholesale_inquiries" ON wholesale_inquiries FOR DELETE
  TO anon USING (false);
