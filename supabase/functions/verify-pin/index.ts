// supabase/functions/verify-pin/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Use bcryptjs which is more compatible with edge runtimes
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

type RequestPayload = {
  action?: 'hash' | 'verify';
  pin?: string;
  hash?: string;
  child_id?: string;
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }
  
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: RequestPayload;
  try {
    payload = (await req.json()) as RequestPayload;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const action = payload?.action;
  const pin = payload?.pin?.trim();

  try {
    // Action: hash - create a bcrypt hash from a PIN
    if (action === 'hash') {
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return jsonResponse(400, { error: "PIN must be exactly 4 digits" });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(pin, salt);
      return jsonResponse(200, { hash });
    }

    // Action: verify - verify a PIN against a provided hash
    if (action === 'verify') {
      const hash = payload?.hash?.trim();
      if (!pin || !hash) {
        return jsonResponse(400, { error: "Missing pin or hash" });
      }
      const valid = bcrypt.compareSync(pin, hash);
      return jsonResponse(200, { valid });
    }

    // Legacy: child PIN verification
    const child_id = payload?.child_id?.trim();
    if (child_id && pin) {
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

      const success = bcrypt.compareSync(pin, data.pin_hash);
      return jsonResponse(200, { success });
    }

    return jsonResponse(400, { error: "Invalid request. Use action: 'hash' or 'verify'" });
  } catch (err) {
    console.error("Function error:", err);
    return jsonResponse(500, { error: "Internal server error" });
  }
});
