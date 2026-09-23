export type ModelId =
  | 'nvidia/nemotron-3-ultra-550b-a55b'
  | 'poolside/laguna-s-2.1'
  | 'inclusionai/ling-3.0-flash-vl'
  | 'inclusionai/ling-3.0-flash-fin'
  | 'google/gemini-2.5-flash'

export type Provider = 'nvidia' | 'poolside' | 'inclusionai' | 'google'

export interface ModelConfig {
  id: ModelId
  label: string
  provider: Provider
  contextWindow: number
}

export const MODELS: ModelConfig[] = [
  { id: 'nvidia/nemotron-3-ultra-550b-a55b', label: 'Nemotron 3 Ultra',   provider: 'nvidia',      contextWindow: 1000000 },
  { id: 'poolside/laguna-s-2.1',             label: 'Laguna S 2.1',       provider: 'poolside',    contextWindow: 262144 },
  { id: 'inclusionai/ling-3.0-flash-vl',     label: 'Ling 3.0 Flash VL',  provider: 'inclusionai', contextWindow: 131072 },
  { id: 'inclusionai/ling-3.0-flash-fin',    label: 'Ling 3.0 Flash Fin', provider: 'inclusionai', contextWindow: 262144 },
  { id: 'google/gemini-2.5-flash',           label: 'Gemini 2.5 Flash',   provider: 'google',      contextWindow: 1048576 },
]
