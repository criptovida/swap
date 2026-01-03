
import { createClient } from '@supabase/supabase-js';

// Replace with your project's URL and anon key
const supabaseUrl = 'https://kvlxlrqrqizditeuwrfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bHhscnFycWl6ZGl0ZXV3cmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzQwMDYsImV4cCI6MjA3NDcxMDAwNn0.nPVGoNOe9tTmesDGidEUmIfg5pr_LVfyrOSZUwYgD_c';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required.");
}

// In a real project, you would generate these types from your Supabase schema
// for full type safety. For now, we'll use a generic type.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);