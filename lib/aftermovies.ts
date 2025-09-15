import { createClientComponentClient } from './supabase'

const supabaseClient = createClientComponentClient()

export type AftermovieRecord = {
  id: string
  title: string
  description?: string | null
  event?: string | null
  video_url: string
  created_at: string
  updated_at: string
}

export async function listAftermovies(): Promise<AftermovieRecord[]> {
  try {
    const { data, error } = await supabaseClient
      .from('aftermovies')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching aftermovies:', error)
      return []
    }
    
    return data ?? []
  } catch (error) {
    console.error('Error in listAftermovies:', error)
    return []
  }
}

// Alias for backward compatibility
export const fetchAftermovies = listAftermovies

export async function uploadVideoToBucket(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
  const key = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabaseClient
    .storage
    .from('aftermovies')
    .upload(key, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'video/mp4',
    })
  if (error) throw error
  const { data } = supabaseClient.storage.from('aftermovies').getPublicUrl(key)
  return data.publicUrl
}

export async function createAftermovie(fields: { title: string; description?: string; event?: string; video_url: string }) {
  const { error } = await supabaseClient.from('aftermovies').insert({
    title: fields.title,
    description: fields.description ?? null,
    event: fields.event ?? null,
    video_url: fields.video_url,
  })
  if (error) throw error
}

export async function updateAftermovieRow(id: string, updates: Partial<{ title: string; description: string; event: string; video_url: string }>) {
  const { error } = await supabaseClient.from('aftermovies').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteAftermovieRow(id: string) {
  const { error } = await supabaseClient.from('aftermovies').delete().eq('id', id)
  if (error) throw error
}

// Additional functions for admin page compatibility
export async function uploadVideoAndCreate(file: File, fields: { title: string; description?: string; event?: string }) {
  try {
    const videoUrl = await uploadVideoToBucket(file)
    await createAftermovie({ ...fields, video_url: videoUrl })
    return { success: true }
  } catch (error) {
    console.error('Error uploading video and creating aftermovie:', error)
    throw error
  }
}

export async function updateAftermovie(id: string, updates: Partial<{ title: string; description: string; event: string; video_url: string }>) {
  try {
    await updateAftermovieRow(id, updates)
    return { success: true }
  } catch (error) {
    console.error('Error updating aftermovie:', error)
    throw error
  }
}

export async function deleteAftermovie(id: string) {
  try {
    await deleteAftermovieRow(id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting aftermovie:', error)
    throw error
  }
}
