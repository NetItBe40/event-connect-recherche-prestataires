// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nhmzmhzfsiuwijyftogg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obXptaHpmc2l1d2lqeWZ0b2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTA1MTgsImV4cCI6MjA0OTQ4NjUxOH0.HTo9XOMKwfewd-l0QN4An0eUsJGIZOaeAFG2qHLQaYE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);