import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nhmzmhzfsiuwijyftogg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obXptaHpmc2l1d2lqeWZ0b2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTA1MTgsImV4cCI6MjA0OTQ4NjUxOH0.HTo9XOMKwfewd-l0QN4An0eUsJGIZOaeAFG2qHLQaYE'
);