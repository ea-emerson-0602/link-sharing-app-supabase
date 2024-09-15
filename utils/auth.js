import { supabase } from '../lib/client'

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data.session
  } catch (error) {
    console.error('Error signing in:', error.message)
    throw error
  }
}

export const signOut = async () => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error.message)
  }
}
