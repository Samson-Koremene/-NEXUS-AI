export type Intent = 'conversation' | 'image_gen' | 'code_exec' | 'web_search' | 'tts'

export interface ToolResult {
  type: Intent
  data: string | object
  error?: string
}
