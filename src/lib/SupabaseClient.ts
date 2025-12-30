import { createClient } from '@supabase/supabase-js'
const url = 'https://jdlomuaimhhuqkgvwbnd.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbG9tdWFpbWhodXFrZ3Z3Ym5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTQ0NTYsImV4cCI6MjA2ODY5MDQ1Nn0.NP2FW_BTPW96CY69bNr26dPjgu47DEKP8t3S00ay0OM'
export const supabase = createClient( url|| "", anonKey || "")
