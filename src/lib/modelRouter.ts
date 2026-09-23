import type { ModelId } from '../types/models'
import type { Message } from '../types/chat'

interface RouterInput {
  model: ModelId
  messages: Message[]
  systemPrompt?: string
}

interface RouterOutput {
  role: 'assistant'
  content: string
}

// Single gateway for every model — OpenRouter exposes an OpenAI-compatible API.
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export async function callLLM(input: RouterInput): Promise<RouterOutput> {
  const { model, messages, systemPrompt = '' } = input

  // NOTE: The secure path routes through the Supabase `chat` Edge Function, which holds
  // OPENROUTER_API_KEY server-side. It is currently bypassed in favour of a direct client
  // call — re-enable before shipping so keys are not exposed in the browser bundle.
  return callOpenRouter(model, messages, systemPrompt)
}

async function callOpenRouter(model: string, messages: Message[], systemPrompt: string): Promise<RouterOutput> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OpenRouter API key missing. Set VITE_OPENROUTER_API_KEY in your .env file.')
  }

  const res = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`OpenRouter error: ${res.status} - ${error}`)
  }

  const data = await res.json()
  return { role: 'assistant', content: data.choices[0].message.content }
}
