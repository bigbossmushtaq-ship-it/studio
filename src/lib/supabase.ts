
import { createClient } from '@supabase/supabase-js'

// Your Supabase project details
const supabaseUrl = "https://kfbdkowaslubunczjjgh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYmRrb3dhc2x1YnVuY3pqamdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjcxMjQsImV4cCI6MjA3MTIwMzEyNH0.EcBcYF77TojLMrMkiL-Wz1cDEIfJQbbU3Hs9beaUm8c"

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
