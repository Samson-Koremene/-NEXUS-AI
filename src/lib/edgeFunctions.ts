import { supabase } from './supabase'

/**
 * Global Edge Function caller with automatic JWT handling
 * Automatically attaches the user's session token to all Edge Function calls
 */
export async function callEdgeFunction(name: string, body: object) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    await supabase.auth.signOut()
    localStorage.clear()
    throw new Error('No active session. Please login again.')
  }

  const response = await supabase.functions.invoke(name, {
    body,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  if (response.error) {
    // Handle JWT errors specifically
    if (response.error.message?.includes('JWT') || response.error.message?.includes('UNAUTHORIZED')) {
      await supabase.auth.signOut()
      localStorage.clear()
      throw new Error('Session expired. Please login again.')
    }
    throw response.error
  }

  return response.data
}
