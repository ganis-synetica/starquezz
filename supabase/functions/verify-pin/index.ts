// supabase/functions/verify-pin/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

type VerifyPinRequest = {
  child_id: string;
  pin: string;
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return jsonResponse(200, { ok: true });
  if (req.method !== "POST") return jsonResponse(405, { error: "Method not allowed" });

  let payload: VerifyPinRequest;
  try {
    payload = (await req.json()) as VerifyPinRequest;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const child_id = payload?.child_id?.trim();
  const pin = payload?.pin?.trim();

  if (!child_id || !pin) {
    return jsonResponse(400, { error: "Missing child_id or pin" });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    return jsonResponse(500, { error: "Server misconfigured" });
  }

  const supabase = createClient(url, serviceRoleKey);

  const { data, error } = await supabase
    .from("children")
    .select("pin_hash")
    .eq("id", child_id)
    .maybeSingle();

  if (error) return jsonResponse(500, { error: "DB error" });
  if (!data?.pin_hash) return jsonResponse(200, { success: false });

  const success = await bcrypt.compare(pin, data.pin_hash);
  return jsonResponse(200, { success });
});
