import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client for general use (anon client)
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Admin client for server-side operations (bypassing RLS safely on API routes)
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseServiceKey || supabaseAnonKey || "placeholder-key"
);

// Helper to check if Supabase is fully configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== "" &&
    supabaseUrl !== "https://your-supabase-url.supabase.co" &&
    supabaseAnonKey !== "" &&
    supabaseAnonKey !== "your-anon-key-here"
  );
};
