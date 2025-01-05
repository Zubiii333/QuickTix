import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhgslpmstscgdlwhgmsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZ3NscG1zdHNjZ2Rsd2hnbXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4ODIxNDksImV4cCI6MjA1MTQ1ODE0OX0.eREJuN6ByEzYb0_5bFl-_JLNQbuB_FuseIvBm_-FMTo';

export const supabase = createClient(supabaseUrl, supabaseKey);