import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY - client will fail until env is set"
  );
}

// Public client (anon) - for client-side & waitlist insert
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Admin client (service_role) - for server-side privileged reads (admin dashboard)
// Falls back to anon client if service key missing (RLS must allow)
export const supabaseAdmin =
  supabaseServiceKey && supabaseUrl
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : supabase;

export type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  position: number;
  created_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
};
