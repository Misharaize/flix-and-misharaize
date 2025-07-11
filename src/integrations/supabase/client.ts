// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rklmnoazxbujrobjqaxb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbG1ub2F6eGJ1anJvYmpxYXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjk4OTAsImV4cCI6MjA2Nzc0NTg5MH0.mWzkiJkqCq05j1Jv3k3lV_OeDLJLw-osFdonBo5djyQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});