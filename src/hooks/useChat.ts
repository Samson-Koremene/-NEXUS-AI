import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '../store/chatStore';
import { classifyIntent } from '../lib/intentClassifier';
import type { Intent } from '../lib/intentClassifier';
import { generateImage } from '../lib/imageService';
import { executeCode } from '../lib/codeService';
import { searchWeb } from '../lib/searchService';
import { generateTTS } from '../lib/ttsService';
import { callLLM } from '../lib/modelRouter';
import { storage } from '../lib/storage';
import type { Message, Session, ResultType, SpecialistResult } from '../types/chat';
import type { ModelId } from '../types/models';
import { CHAT_MODES } from '../types/modes';

function generateId() {
  return crypto.randomUUID();
}

// API keys for specialist services only (image generation, TTS, code execution, web search).
// All LLM calls now route through the single OpenRouter gateway inside modelRouter.ts.
function getApiKeysForRouting() {
  return {
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    serper: import.meta.env.VITE_SERPER_API_KEY || '',
    judge0: import.meta.env.VITE_JUDGE0_API_KEY || '',
  };
}

function intentToResultType(intent: Intent): ResultType {
  switch (intent) {
    case 'image_gen': return 'image';
    case 'code_exec': return 'code';
    case 'web_search': return 'search';
    case 'tts':       return 'audio';
    default:          return 'text';
  }
}

// Map low-level provider/network errors into friendly, non-leaky user messages.
function toFriendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  const lower = raw.toLowerCase();

  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('load failed')) {
    return "I couldn't reach the AI service. Please check your internet connection and try again.";
  }
  if (lower.includes('401') || lower.includes('403') || lower.includes('invalid api key') || lower.includes('unauthorized')) {
    return 'The AI service rejected the request due to an authentication problem. Please try again or contact support.';
  }
  if (lower.includes('429') || lower.includes('rate limit') || lower.includes('quota')) {
    return "We're hitting the AI provider's rate limit right now. Please wait a moment and try again.";
  }
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'The AI service took too long to respond. Please try again.';
  }
  if (lower.includes('api key missing') || lower.includes('not configured') || lower.includes('missing')) {
    return "The AI service isn't configured yet. Please check the app settings.";
  }
  return 'Something went wrong while generating the response. Please try again.';
}

export function useChat() {
  // Actions are stable references; reactive state is read fresh via getState() inside async code.
  const { isLoading, addMessage, updateMessage, removeLastMessage, setLoading, setSession } = useChatStore();
  const keys = getApiKeysForRouting();
  const lastUserTextRef = useRef<string>('');

  const saveCurrentSession = (updatedMessages: Message[]) => {
    const { currentSessionId, activeModel } = useChatStore.getState();
    const sessionId = currentSessionId || generateId();
    const prev = storage.getSessions().find(s => s.id === sessionId);
    const session: Session = {
      id: sessionId,
      title: updatedMessages[0]?.content.slice(0, 30) || 'New Chat',
      messages: updatedMessages,
      model: activeModel,
      createdAt: currentSessionId ? prev?.createdAt || Date.now() : Date.now(),
      updatedAt: Date.now(),
    };
    storage.saveSession(session);
    if (!currentSessionId) {
      setSession(session);
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ text: userText, isRetry = false }: { text: string; isRetry?: boolean }) => {
      setLoading(true);
      lastUserTextRef.current = userText;
      const { activeModel, chatMode } = useChatStore.getState();

      // Read the freshest messages from the store (avoids stale-closure bugs).
      let currentHistory: Message[];
      if (isRetry) {
        // Drop the trailing error message; the user message is already in history.
        removeLastMessage();
        currentHistory = useChatStore.getState().messages;
      } else {
        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          content: userText,
          resultType: 'text',
          timestamp: Date.now(),
        };
        addMessage(userMessage);
        currentHistory = useChatStore.getState().messages;
        saveCurrentSession(currentHistory);
      }

      // Get mode-specific system prompt
      const modeSystemPrompt = CHAT_MODES[chatMode].systemPrompt;

      // Step 1: Classify Intent (uses the default classifier model via OpenRouter)
      const classification = await classifyIntent(userText, currentHistory);

      const assistantMessageId = generateId();
      const initialAssistantMsg: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        resultType: 'text',
        model: activeModel,
        timestamp: Date.now(),
      };
      addMessage(initialAssistantMsg);

      let finalContent = '';
      let specialistResult: SpecialistResult | undefined = undefined;
      let finalResultType: ResultType = intentToResultType(classification.intent);
      let isError = false;

      // Graceful fallback: when a specialist tool fails (missing API key, provider error, …),
      // answer the original message through the LLM as a normal conversation instead of
      // surfacing a raw error. If this fallback itself fails, the outer catch reports it.
      const fallbackToConversation = async (reason: unknown): Promise<void> => {
        console.warn(`[useChat] "${classification.intent}" specialist failed, falling back to conversation:`, reason);
        specialistResult = undefined;
        finalResultType = 'text';
        const fallbackRes = await callLLM({
          model: activeModel as ModelId,
          messages: currentHistory,
          systemPrompt: modeSystemPrompt,
        });
        finalContent = fallbackRes.content;
      };

      try {
        switch (classification.intent) {
          case 'image_gen':
            try {
              if (!keys.openai) throw new Error("OpenAI key required for DALL-E 3");
              const imageUrl = await generateImage(classification.params.image_prompt || userText, keys.openai);
              specialistResult = imageUrl;
              finalContent = 'Here is the image you requested:';
            } catch (err) {
              await fallbackToConversation(err);
            }
            break;

          case 'code_exec':
            if (!classification.params.code) {
              // Nothing to run — answer as a normal conversation.
              const llmRes = await callLLM({ model: activeModel as ModelId, messages: currentHistory });
              finalContent = llmRes.content;
              finalResultType = 'text'; // No code executed
            } else {
              try {
                if (!keys.judge0) throw new Error("Judge0 RapidAPI key required for code execution");
                const output = await executeCode(classification.params.code, classification.params.language || 'javascript', keys.judge0);
                specialistResult = { code: classification.params.code, language: classification.params.language, output };
                finalContent = 'Execution finished.';
              } catch (err) {
                await fallbackToConversation(err);
              }
            }
            break;

          case 'web_search':
            try {
              if (!keys.serper) throw new Error("Serper API key required for web search");
              const searchResults = await searchWeb(classification.params.query || userText, keys.serper);

              // Pass results back to LLM to synthesize
              const synthesizePrompt = `Web search results for "${classification.params.query}":\n` +
                searchResults.map(r => `- ${r.title}: ${r.snippet} (${r.link})`).join('\n') +
                `\n\nProvide a synthesized answer based on these results.`;

              const synthRes = await callLLM({
                model: activeModel as ModelId,
                messages: [...currentHistory, { id: 's', role: 'user', content: synthesizePrompt, resultType: 'text', timestamp: Date.now() }],
              });

              specialistResult = searchResults;
              finalContent = synthRes.content;
            } catch (err) {
              await fallbackToConversation(err);
            }
            break;

          case 'tts':
            try {
              if (!keys.openai) throw new Error("OpenAI key required for TTS");
              const textToSpeak = classification.params.text || userText;
              const audioUrl = await generateTTS(textToSpeak, keys.openai);
              specialistResult = audioUrl;
              finalContent = textToSpeak;
            } catch (err) {
              await fallbackToConversation(err);
            }
            break;

          case 'conversation':
          default: {
            const chatRes = await callLLM({
              model: activeModel as ModelId,
              messages: currentHistory,
              systemPrompt: modeSystemPrompt,
            });
            finalContent = chatRes.content;
            break;
          }
        }
      } catch (err: unknown) {
        // Final safety net — specialist tool failures are handled by fallbackToConversation
        // above; this only fires when the LLM call itself is unreachable (or a conversation error).
        finalContent = toFriendlyError(err);
        finalResultType = 'text';
        specialistResult = undefined;
        isError = true;
      }

      updateMessage(assistantMessageId, {
        content: finalContent,
        resultType: finalResultType,
        specialistResult,
        isError,
      });

      // Update session after AI response
      saveCurrentSession(useChatStore.getState().messages);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  return {
    sendMessage: (text: string) => mutation.mutate({ text }),
    retry: () => {
      if (!lastUserTextRef.current) return;
      mutation.mutate({ text: lastUserTextRef.current, isRetry: true });
    },
    isLoading: mutation.isPending || isLoading,
  };
}
