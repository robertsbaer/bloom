
CREATE TABLE IF NOT EXISTS product_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text,
  issue_description text,
  contact_info text,
  other text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_product_reports" ON product_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "deny_select_product_reports" ON product_reports FOR SELECT TO anon USING (false);
CREATE POLICY "deny_update_product_reports" ON product_reports FOR UPDATE TO anon USING (false);
CREATE POLICY "deny_delete_product_reports" ON product_reports FOR DELETE TO anon USING (false);

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_email_signups" ON email_signups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "deny_select_email_signups" ON email_signups FOR SELECT TO anon USING (false);
CREATE POLICY "deny_update_email_signups" ON email_signups FOR UPDATE TO anon USING (false);
CREATE POLICY "deny_delete_email_signups" ON email_signups FOR DELETE TO anon USING (false);
