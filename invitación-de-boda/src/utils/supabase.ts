import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhlmxdxccsemckiccrsr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobG14ZHhjY3NlbWNraWNjcnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTMwMDgsImV4cCI6MjA5NzQ4OTAwOH0.fLY0NB0tRxv1raGapkX_s1IbLoxu7pFIbMIGW7ZtrRc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

