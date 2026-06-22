import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '../store/chatStore';
import { classifyIntent } from '../lib/intentClassifier';
import { generateImage } from '../lib/imageService';
import { executeCode } from '../lib/codeService';
import { searchWeb } from '../lib/searchService';
import { generateTTS } from '../lib/ttsService';
import { callLLM } from '../lib/modelRouter';
import { storage } from '../lib/storage';
import { Message, Session } from '../types/chat';
import { ModelId } from '../types/models';
import { CHAT_MODES } from '../types/modes';

function generateId() {
  return crypto.randomUUID();
}

// Get API keys from environment variables
function getApiKeysForRouting() {
  return {
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    google: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
    groq: import.meta.env.VITE_GROQ_API_KEY || '',
    serper: import.meta.env.VITE_SERPER_API_KEY || '',
    judge0: import.meta.env.VITE_JUDGE0_API_KEY || '',
  };
}

export function useChat() {
  const { currentSessionId, messages, activeModel, isLoading, chatMode, addMessage, updateMessage, setLoading, setSession } = useChatStore();
  const keys = getApiKeysForRouting();

  const saveCurrentSession = (updatedMessages: Message[]) => {
    const sessionId = currentSessionId || generateId();
    const session: Session = {
      id: sessionId,
      title: updatedMessages[0]?.content.slice(0, 30) || 'New Chat',
      messages: updatedMessages,
      model: activeModel,
      createdAt: currentSessionId ? storage.getSessions().find(s => s.id === sessionId)?.createdAt || Date.now() : Date.now(),
      updatedAt: Date.now(),
    };
    storage.saveSession(session);
    if (!currentSessionId) {
      setSession(session);
    }
  };

  const mutation = useMutation({
    mutationFn: async (userText: string) => {
      setLoading(true);
      
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: userText,
        resultType: 'text',
        timestamp: Date.now(),
      };
      
      addMessage(userMessage);
      const currentHistory = [...messages, userMessage];
      saveCurrentSession(currentHistory);

      const apiKeys = getApiKeysForRouting();
      
      // Get mode-specific system prompt
      const modeSystemPrompt = CHAT_MODES[chatMode].systemPrompt;
      
      // Step 1: Classify Intent
      const classification = await classifyIntent(userText, messages, activeModel as ModelId, apiKeys);
      
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
      let specialistResult: any = undefined;
      let finalResultType = classification.intent === 'conversation' ? 'text' : 
                            classification.intent === 'image_gen' ? 'image' :
                            classification.intent === 'code_exec' ? 'code' :
                            classification.intent === 'web_search' ? 'search' : 'audio';

      try {
        switch (classification.intent) {
          case 'image_gen':
            if (!keys.openai) throw new Error("OpenAI key required for DALL-E 3");
            const imageUrl = await generateImage(classification.params.image_prompt || userText, keys.openai);
            specialistResult = imageUrl;
            finalContent = 'Here is the image you requested:';
            break;

          case 'code_exec':
            if (!keys.judge0) throw new Error("Judge0 RapidAPI key required for code execution");
            if (!classification.params.code) {
               const llmRes = await callLLM({ model: activeModel as ModelId, messages: currentHistory, apiKeys });
               finalContent = llmRes.content;
               finalResultType = 'text'; // No code executed
            } else {
               const output = await executeCode(classification.params.code, classification.params.language || 'javascript', keys.judge0);
               specialistResult = { code: classification.params.code, language: classification.params.language, output };
               finalContent = 'Execution finished.';
            }
            break;

          case 'web_search':
            if (!keys.serper) throw new Error("Serper API key required for web search");
            const searchResults = await searchWeb(classification.params.query || userText, keys.serper);
            
            // Pass results back to LLM to synthesize
            const synthesizePrompt = `Web search results for "${classification.params.query}":\n` + 
              searchResults.map((r: any) => `- ${r.title}: ${r.snippet} (${r.link})`).join('\n') +
              `\n\nProvide a synthesized answer based on these results.`;
            
            const synthRes = await callLLM({ 
              model: activeModel as ModelId, 
              messages: [...currentHistory, { id: 's', role: 'user', content: synthesizePrompt, resultType: 'text', timestamp: Date.now() }], 
              apiKeys 
            });
            
            specialistResult = searchResults;
            finalContent = synthRes.content;
            break;

          case 'tts':
            if (!keys.openai) throw new Error("OpenAI key required for TTS");
            const textToSpeak = classification.params.text || userText;
            const audioUrl = await generateTTS(textToSpeak, keys.openai);
            specialistResult = audioUrl;
            finalContent = textToSpeak;
            break;

          case 'conversation':
          default:
            const chatRes = await callLLM({ 
              model: activeModel as ModelId, 
              messages: currentHistory, 
              systemPrompt: modeSystemPrompt,
              apiKeys 
            });
            finalContent = chatRes.content;
            break;
        }
      } catch (err: any) {
        finalContent = `**Error:** ${err.message || 'An unexpected error occurred.'}`;
        finalResultType = 'text';
      }

      updateMessage(assistantMessageId, {
        content: finalContent,
        resultType: finalResultType as any,
        specialistResult,
      });

      // Update session after AI response
      const latestMessages = useChatStore.getState().messages;
      saveCurrentSession(latestMessages);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  return {
    sendMessage: mutation.mutateAsync,
    isLoading: mutation.isPending || isLoading,
  };
}
