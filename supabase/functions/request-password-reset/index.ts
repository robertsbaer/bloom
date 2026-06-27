// @ts-nocheck
// v1.0.1
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { email } = await req.json();

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: email,
    redirectTo: "https://mybloom55.com/update-password",
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const link = data.properties.action_link;

  // Now, send the email using the send-smtp-email function
  const { error: sendError } = await supabaseAdmin.functions.invoke(
    "send-smtp-email",
    {
      body: {
        type: "password-reset",
        email: email,
        name: email, // Don't have name, use email
        link: link,
      },
    },
  );

  if (sendError) {
    return new Response(JSON.stringify({ error: sendError.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Password reset email sent." }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    },
  );
});
