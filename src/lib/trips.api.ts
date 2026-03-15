import { supabase } from './supabase'
import type { Trip, TripWithAuthor } from '../types'

export const createTrip = async (
    trip: Omit<Trip, 'id' | 'created_at'>
): Promise<Trip> => {
    const { data, error } = await supabase
    .from('trips')
    .insert(trip)
    .select()
    .single()

    if (error) throw error
    return data
}

export const getTrip = async (tripId: string): Promise<Trip> => {
    const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .maybeSingle()

    if (error) throw error
    if (!data) throw new Error('Trip not found')
    return data
}

export const getAllTrips = async (): Promise<Trip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getAllTripsWithAuthors = async (): Promise<TripWithAuthor[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*, profile(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as TripWithAuthor[]
}