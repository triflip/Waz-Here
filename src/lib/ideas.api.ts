
import { supabase } from './supabase'
import type { Trip } from '../types'

export const isIdeaSaved = async (
  userId: string,
  tripId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from('ideas')
    .select('id')
    .eq('user_id', userId)
    .eq('trip_id', tripId)
    .maybeSingle()

  return !!data
}

export const saveIdea = async (
  userId: string,
  tripId: string
): Promise<void> => {
  const { error } = await supabase
    .from('ideas')
    .insert({ user_id: userId, trip_id: tripId })

  if (error) throw error
}

export const removeIdea = async (
  userId: string,
  tripId: string
): Promise<void> => {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('user_id', userId)
    .eq('trip_id', tripId)

  if (error) throw error
}

export const toggleIdea = async (
  userId: string,
  tripId: string
): Promise<boolean> => {
  const saved = await isIdeaSaved(userId, tripId)
  if (saved) {
    await removeIdea(userId, tripId)
    return false
  } else {
    await saveIdea(userId, tripId)
    return true
  }
}

export const getIdeasByUser = async (userId: string): Promise<Trip[]> => {
  const { data, error } = await supabase
    .from('ideas')
    .select('trip_id, trips(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((item) => item.trips as unknown as Trip)
}