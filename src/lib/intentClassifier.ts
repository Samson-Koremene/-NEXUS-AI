import type { Message } from '../types/chat'
import type { ModelId } from '../types/models'
import { callLLM } from './modelRouter'

export type Intent =
  | 'conversation'
  | 'image_gen'
  | 'code_exec'
  | 'web_search'
  | 'tts'

export interface IntentParams {
  image_prompt?: string
  code?: string
  language?: string
  query?: string
  text?: string
}

export interface ClassifiedIntent {
  intent: Intent
  confidence: number
  params: IntentParams
}

const CLASSIFIER_SYSTEM = `You are an intent classifier for an AI assistant.
Analyse the user message and conversation history.
Respond ONLY with a valid JSON object — no markdown, no explanation, no backticks.
Use this exact shape:
{
  "intent": "conversation" | "image_gen" | "code_exec" | "web_search" | "tts",
  "confidence": 0.0-1.0,
  "params": {
    "image_prompt": "string (only if image_gen)",
    "code": "string (only if code_exec)",
    "language": "python|javascript|java|cpp (only if code_exec)",
    "query": "string (only if web_search)",
    "text": "string (only if tts)"
  }
}

Intent rules:
- image_gen: user wants an image drawn, generated, created, or visualised
- code_exec: user wants code written AND run/executed, or asks to run existing code
- web_search: user asks about current events, live data, prices, news, or says 'search for'
- tts: user asks to read aloud, speak, or convert text to audio
- conversation: everything else including general coding help without execution`

export async function classifyIntent(
  userMessage: string,
  history: Message[],
  model: ModelId,
  apiKeys: { openai?: string; anthropic?: string; google?: string }
): Promise<ClassifiedIntent> {
  const last5 = history.slice(-5)

  try {
    const result = await callLLM({
      model,
      messages: [
        ...last5,
        { id: 'classify', role: 'user', content: userMessage, resultType: 'text', timestamp: Date.now() },
      ],
      systemPrompt: CLASSIFIER_SYSTEM,
      apiKeys,
    })

    const raw = result.content.trim()
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as ClassifiedIntent

    const validIntents: Intent[] = ['conversation', 'image_gen', 'code_exec', 'web_search', 'tts']
    if (!validIntents.includes(parsed.intent)) {
      throw new Error(`Invalid intent: ${parsed.intent}`)
    }

    return parsed
  } catch (err) {
    console.warn('[intentClassifier] fallback to conversation:', err)
    return {
      intent: 'conversation',
      confidence: 1.0,
      params: {},
    }
  }
}
