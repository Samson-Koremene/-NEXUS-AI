import type { ModelId } from '../types/models'
import type { Message } from '../types/chat'
import { isSupabaseConfigured } from './supabase'
import { callEdgeFunction } from './edgeFunctions'

interface RouterInput {
  model: ModelId
  messages: Message[]
  systemPrompt?: string
  apiKeys: {
    openai?: string
    anthropic?: string
    google?: string
    groq?: string
  }
}

interface RouterOutput {
  role: 'assistant'
  content: string
}

export async function callLLM(input: RouterInput): Promise<RouterOutput> {
  const { model, messages, systemPrompt = '', apiKeys } = input

  // If Supabase is configured, use Edge Functions (secure)
  if (isSupabaseConfigured()) {
    return callViaSupabase(model, messages, systemPrompt)
  }

  // Fallback to direct API calls (legacy mode, requires API keys)
  if (model.startsWith('gpt'))    return callOpenAI(model, messages, systemPrompt, apiKeys.openai!)
  if (model.startsWith('claude')) return callAnthropic(model, messages, systemPrompt, apiKeys.anthropic!)
  if (model.startsWith('gemini')) return callGemini(model, messages, systemPrompt, apiKeys.google!)
  if (model.startsWith('llama') || model.startsWith('mixtral') || model.startsWith('gemma')) {
    return callGroq(model, messages, systemPrompt, apiKeys.groq!)
  }

  throw new Error(`Unknown model: ${model}`)
}

async function callViaSupabase(model: string, messages: Message[], systemPrompt: string): Promise<RouterOutput> {
  // Determine which Edge Function to call based on model
  const functionName = (model.startsWith('llama') || model.startsWith('mixtral') || model.startsWith('gemma')) 
    ? 'groq' 
    : 'chat'

  const data = await callEdgeFunction(functionName, {
    model,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    systemPrompt,
  })

  if (data?.error) throw new Error(data.error)

  return data as RouterOutput
}

async function callOpenAI(model: string, messages: Message[], system: string, apiKey: string): Promise<RouterOutput> {
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
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
  const data = await res.json()
  return { role: 'assistant', content: data.choices[0].message.content }
}

async function callAnthropic(model: string, messages: Message[], system: string, apiKey: string): Promise<RouterOutput> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`)
  const data = await res.json()
  return { role: 'assistant', content: data.content[0].text }
}

async function callGemini(model: string, messages: Message[], system: string, apiKey: string): Promise<RouterOutput> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
  })
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  return { role: 'assistant', content: data.candidates[0].content.parts[0].text }
}

async function callGroq(model: string, messages: Message[], system: string, apiKey: string): Promise<RouterOutput> {
  const apiMessages = system 
    ? [{ role: 'system', content: system }, ...messages.map(m => ({ role: m.role, content: m.content }))]
    : messages.map(m => ({ role: m.role, content: m.content }))

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Groq error: ${res.status} - ${error}`)
  }

  const data = await res.json()
  return { role: 'assistant', content: data.choices[0].message.content }
}
