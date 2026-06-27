
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
    const { record } = await req.json();

    const { data, error } = await supabase.functions.invoke("send-smtp-email", {
        body: {
            ...record,
            to: record.email,
        },
    });

    if (error) {
        console.error(error);
    }

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
});
