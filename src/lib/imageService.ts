import { isSupabaseConfigured } from './supabase'
import { callEdgeFunction } from './edgeFunctions'

export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  // Use Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    const data = await callEdgeFunction('image-gen', { prompt })

    if (data?.error) throw new Error(data.error)

    return data.url
  }

  // Fallback to direct API call
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Image generation error: ${res.status}`);
  }

  const data = await res.json();
  return data.data[0].url;
}
