import { createServerClient } from './supabase-server'
import { supabase } from './supabase'

export async function signUp(email: string, password: string, name: string, department: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        department,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        name,
        department,
        role: 'General',
      })

    if (profileError) {
      return { error: 'プロフィール作成に失敗しました' }
    }
  }

  return { data }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
