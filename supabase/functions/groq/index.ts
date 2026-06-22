// Supabase Edge Function for Groq (Free LLM API)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface GroqRequest {
  model: string
  messages: Message[]
  systemPrompt?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, messages, systemPrompt = '' } = await req.json() as GroqRequest
    const apiKey = Deno.env.get('GROQ_API_KEY')

    if (!apiKey) {
      throw new Error('Groq API key not configured')
    }

    // Prepare messages array with system prompt if provided
    const apiMessages: Message[] = []
    
    if (systemPrompt) {
      apiMessages.push({ role: 'system', content: systemPrompt })
    }
    
    // Add user/assistant messages
    apiMessages.push(...messages)

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      throw new Error(`Groq API error: ${res.status} - ${error}`)
    }

    const data = await res.json()
    
    return new Response(JSON.stringify({ 
      role: 'assistant', 
      content: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Groq function error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
