import { isSupabaseConfigured } from './supabase'
import { callEdgeFunction } from './edgeFunctions'

export async function generateTTS(text: string, apiKey: string): Promise<string> {
  // Use Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    const data = await callEdgeFunction('tts', { text })

    if (data?.error) throw new Error(data.error)

    return data.url
  }

  // Fallback to direct API call
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: 'alloy',
      input: text
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `TTS API error: ${res.status}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
