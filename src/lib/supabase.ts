import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.warn("Notice: NEXT_PUBLIC_SUPABASE_URL is not set.");
}

// Client for public reads (cached at edge or directly in client views)
export const supabasePublic = createClient(
  supabaseUrl,
  supabaseAnonKey || "dummy-anon-key",
  {
    auth: {
      persistSession: false,
    },
  }
);

// Admin client for Server Actions (bypasses RLS to guarantee owner mutations succeed)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey || "dummy-service-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
