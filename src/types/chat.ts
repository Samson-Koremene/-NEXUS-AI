export type Role = 'user' | 'assistant'
export type ResultType = 'text' | 'image' | 'audio' | 'code' | 'search'

export interface Message {
  id: string
  role: Role
  content: string
  resultType: ResultType
  specialistResult?: string | object
  model?: string
  timestamp: number
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
  updatedAt: number
}
