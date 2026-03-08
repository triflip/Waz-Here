import { supabase } from './supabase'

export const uploadImage = async (
  bucket: 'trip-images' | 'avatar',
  file: File,
  userId: string
): Promise<string> => {


  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error


  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return data.publicUrl
}


export const deleteImage = async (
  bucket: 'trip-images' | 'avatar',
  url: string
): Promise<void> => {

  const path = url.split(`${bucket}/`)[1]
  if (!path) return

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}