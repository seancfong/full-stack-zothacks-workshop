import { createClient } from "@supabase/supabase-js";

// Note: these environment variables are still visible to any user; I'm just not committing them to source control :)
const SUPABASE_PROJECT = import.meta.env.VITE_SUPABASE_PROJECT;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_PROJECT, SUPABASE_ANON_KEY);
