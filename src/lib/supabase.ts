import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dualmindsorg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YWxtaW5kc29yZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5NzU2NjY5LCJleHAiOjIwMjUzMzI2Njl9.Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs_Hs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);