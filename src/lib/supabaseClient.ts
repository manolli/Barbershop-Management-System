import { createClient } from '@supabase/supabase-js';

// Supabase URL and Anon Key from the task description
const supabaseUrl = 'https://vszjevanmfmemkuaoqku.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzempldmFubWZtZW1rdWFvcWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTIzNDgsImV4cCI6MjA2NDQ2ODM0OH0.8DVnIcucD_iYT4bKlb-z2J1jUFIEI3naxLBHGPjDkik';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
