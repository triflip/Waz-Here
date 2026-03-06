import { supabase } from './supabase'
import type { Profile, Trip } from '../types'

export const getProfile = async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()

    if (error) throw error
    return data
}

export const getTripsByUser = async (userId: string): Promise<Trip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}




