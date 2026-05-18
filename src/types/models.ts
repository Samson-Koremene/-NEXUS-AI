export type ModelId =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-haiku-20240307'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'

export type Provider = 'openai' | 'anthropic' | 'google'

export interface ModelConfig {
  id: ModelId
  label: string
  provider: Provider
  contextWindow: number
}

export const MODELS: ModelConfig[] = [
  { id: 'gpt-4o',                      label: 'GPT-4o',           provider: 'openai',    contextWindow: 128000 },
  { id: 'gpt-4o-mini',                  label: 'GPT-4o mini',      provider: 'openai',    contextWindow: 128000 },
  { id: 'claude-3-5-sonnet-20241022',   label: 'Claude 3.5 Sonnet',provider: 'anthropic', contextWindow: 200000 },
  { id: 'claude-3-haiku-20240307',      label: 'Claude 3 Haiku',   provider: 'anthropic', contextWindow: 200000 },
  { id: 'gemini-2.5-pro',               label: 'Gemini 2.5 Pro',   provider: 'google',    contextWindow: 1000000 },
  { id: 'gemini-2.5-flash',             label: 'Gemini 2.5 Flash', provider: 'google',    contextWindow: 1000000 },
]
