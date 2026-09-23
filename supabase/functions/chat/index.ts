// Supabase Edge Function — OpenRouter LLM gateway
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  model: string
  messages: Message[]
  systemPrompt?: string
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, messages, systemPrompt = '' } = await req.json() as ChatRequest

    const apiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    // Prepend the system prompt when provided
    const apiMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`OpenRouter error: ${res.status} - ${error}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('Invalid response from OpenRouter API')
    }

    // Same response structure the client expects
    return new Response(JSON.stringify({ role: 'assistant', content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
