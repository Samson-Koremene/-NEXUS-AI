export type ModelId =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-haiku-20240307'
  | 'gemini-2.0-flash-exp'
  | 'gemini-1.5-pro'
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'mixtral-8x7b-32768'

export type Provider = 'openai' | 'anthropic' | 'google' | 'groq'

export interface ModelConfig {
  id: ModelId
  label: string
  provider: Provider
  contextWindow: number
}

export const MODELS: ModelConfig[] = [
  { id: 'llama-3.3-70b-versatile',      label: '🆓 Llama 3.3 70B',  provider: 'groq',      contextWindow: 128000 },
  { id: 'llama-3.1-8b-instant',         label: '🆓 Llama 3.1 8B',   provider: 'groq',      contextWindow: 128000 },
  { id: 'mixtral-8x7b-32768',           label: '🆓 Mixtral 8x7B',   provider: 'groq',      contextWindow: 32768 },
  { id: 'gpt-4o',                       label: 'GPT-4o',            provider: 'openai',    contextWindow: 128000 },
  { id: 'gpt-4o-mini',                  label: 'GPT-4o mini',       provider: 'openai',    contextWindow: 128000 },
  { id: 'claude-3-5-sonnet-20241022',   label: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000 },
  { id: 'claude-3-haiku-20240307',      label: 'Claude 3 Haiku',    provider: 'anthropic', contextWindow: 200000 },
  { id: 'gemini-2.0-flash-exp',         label: 'Gemini 2.0 Flash',  provider: 'google',    contextWindow: 1000000 },
  { id: 'gemini-1.5-pro',               label: 'Gemini 1.5 Pro',    provider: 'google',    contextWindow: 1000000 },
]
