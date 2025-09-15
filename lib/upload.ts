import { createClientComponentClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

export async function uploadFile(
  file: File,
  bucket: 'events' | 'avatars' | 'logos',
  path: string
): Promise<{ url: string; error: any }> {
  const supabase = createClientComponentClient()
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { url: '', error }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    return { url: '', error }
  }
}

export async function deleteFile(
  bucket: 'events' | 'avatars' | 'logos',
  path: string
): Promise<{ error: any }> {
  const supabase = createClientComponentClient()
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    return { error }
  } catch (error) {
    return { error }
  }
}

export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  
  if (prefix) {
    return `${prefix}/${timestamp}-${randomString}.${extension}`
  }
  
  return `${timestamp}-${randomString}.${extension}`
}

export function validateFile(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file size (default 5MB)
  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  return { valid: true }
}
