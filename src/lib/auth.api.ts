import { supabase } from './supabase'

export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  city: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  if (!data.user) throw new Error('No user returned')

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      full_name: fullName,
      city,
      avatar_url: '',
      description: '',
    })

  if (profileError) throw profileError

  return data.user
}

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data.user
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}