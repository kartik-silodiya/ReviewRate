/// <reference types="vite/client" />
// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Get the URL and Key from the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)