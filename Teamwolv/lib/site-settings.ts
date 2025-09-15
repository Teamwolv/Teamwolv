import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supa = createClient(url, anon)

export type SiteSettings = {
  id: string
  site_name: string | null
  site_description: string | null
  logo_url: string | null
  primary_color: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_location: string | null
  social_facebook: string | null
  social_twitter: string | null
  social_instagram: string | null
  social_linkedin: string | null
  created_at: string
  updated_at: string
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supa.from('site_settings').select('*').order('created_at', { ascending: true }).limit(1).maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function upsertSiteSettings(values: Partial<SiteSettings>): Promise<void> {
  // Always keep single-row settings with id = 'main'
  const payload = { id: 'main', ...values }
  const { error } = await supa.from('site_settings').upsert(payload, { onConflict: 'id' })
  if (error) throw error
}

