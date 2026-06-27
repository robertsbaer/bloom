
CREATE OR REPLACE FUNCTION trigger_send_wholesale_email() RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    'https://tjzgsdkvwoenlscxtwnd.supabase.co/functions/v1/send-wholesale-email',
    json_build_object('record', NEW)::text,
    'application/json',
    '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqemdzzGRrdnBvZW5sc2N4dHduZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE5NDE5MDIyLCJleHAiOjIwMzQ5OTUwMjJ9.hVv-C6n-U32b_q1I8UVw-i5mY28A5a0N4Jsx_T2lAt0"}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_wholesale_inquiry_created
AFTER INSERT ON wholesale_inquiries
FOR EACH ROW
EXECUTE FUNCTION trigger_send_wholesale_email();
