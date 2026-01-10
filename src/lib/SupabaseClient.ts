import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://deprcdzguzibywchgqtb.supabase.co'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHJjZHpndXppYnl3Y2hncXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTk5MzksImV4cCI6MjA4MjY5NTkzOX0.DFeQLPbuRAf_69droZWpOwB2w3y6zvVcepLTauy2M48'

if (!url || !anonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(url, anonKey)