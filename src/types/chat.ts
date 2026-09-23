import type { SearchResultItem } from '../lib/searchService'

export type Role = 'user' | 'assistant'
export type ResultType = 'text' | 'image' | 'audio' | 'code' | 'search'

/** Structured payload produced by the code-execution specialist. */
export interface CodeResultData {
  code: string
  language?: string
  output: string
}

/**
 * Union of every specialist payload a message can carry:
 * - `string`            → image / audio URL
 * - `CodeResultData`    → executed code + output
 * - `SearchResultItem[]`→ web search results
 */
export type SpecialistResult = string | CodeResultData | SearchResultItem[]

export interface Message {
  id: string
  role: Role
  content: string
  resultType: ResultType
  specialistResult?: SpecialistResult
  model?: string
  timestamp: number
  /** Marks a message that holds a (friendly) error, enabling a retry affordance. */
  isError?: boolean
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
  updatedAt: number
}
