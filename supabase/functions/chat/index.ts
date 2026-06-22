// Supabase Edge Function for LLM routing
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, messages, systemPrompt = '' } = await req.json() as ChatRequest

    // Get API keys from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    const googleKey = Deno.env.get('GOOGLE_AI_API_KEY')

    let response: { role: 'assistant'; content: string }

    if (model.startsWith('gpt')) {
      if (!openaiKey) throw new Error('OpenAI API key not configured')
      response = await callOpenAI(model, messages, systemPrompt, openaiKey)
    } else if (model.startsWith('claude')) {
      if (!anthropicKey) throw new Error('Anthropic API key not configured')
      response = await callAnthropic(model, messages, systemPrompt, anthropicKey)
    } else if (model.startsWith('gemini')) {
      if (!googleKey) throw new Error('Google AI API key not configured')
      response = await callGemini(model, messages, systemPrompt, googleKey)
    } else {
      throw new Error(`Unknown model: ${model}`)
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function callOpenAI(model: string, messages: Message[], system: string, apiKey: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`OpenAI error: ${res.status} - ${error}`)
  }

  const data = await res.json()
  return { role: 'assistant' as const, content: data.choices[0].message.content }
}

async function callAnthropic(model: string, messages: Message[], system: string, apiKey: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Anthropic error: ${res.status} - ${error}`)
  }

  const data = await res.json()
  return { role: 'assistant' as const, content: data.content[0].text }
}

async function callGemini(model: string, messages: Message[], system: string, apiKey: string) {
  // Google's new OAuth token format requires different authentication
  const isOAuthKey = apiKey.startsWith('AQ.')
  
  // For OAuth tokens, we need to use the Google AI SDK endpoint
  const baseUrl = isOAuthKey 
    ? 'https://generativelanguage.googleapis.com/v1beta'
    : 'https://generativelanguage.googleapis.com/v1beta'
  
  const url = isOAuthKey
    ? `${baseUrl}/models/${model}:generateContent`
    : `${baseUrl}/models/${model}:generateContent?key=${apiKey}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add authorization header for OAuth tokens
  if (isOAuthKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
    headers['x-goog-api-key'] = apiKey
  }

  const requestBody: any = {
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  }
  
  // Only add system instruction if provided
  if (system) {
    requestBody.system_instruction = { parts: [{ text: system }] }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Gemini error: ${res.status} - ${error}`)
  }

  const data = await res.json()
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API')
  }
  
  return { role: 'assistant' as const, content: data.candidates[0].content.parts[0].text }
}
