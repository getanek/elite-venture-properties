import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const BUCKET = "contracts";

let _admin: SupabaseClient | null = null;
let _public: SupabaseClient | null = null;

export function getAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    _admin = createClient(url, key, { auth: { persistSession: false } });
  }
  return _admin;
}

export function getPublic(): SupabaseClient {
  if (!_public) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase public env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    _public = createClient(url, key);
  }
  return _public;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, p) {
    return Reflect.get(getAdmin() as object, p);
  },
});

export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_t, p) {
    return Reflect.get(getPublic() as object, p);
  },
});
