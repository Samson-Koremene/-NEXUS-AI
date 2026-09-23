
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../store/chatStore';
import { Pencil, Globe } from 'lucide-react';
import { CHAT_MODES } from '../types/modes';
import type { ChatMode } from '../types/modes';

const SUGGESTIONS: { text: string; icon: typeof Pencil; prompt: string; mode: ChatMode }[] = [
  { text: 'Write or edit',   icon: Pencil, prompt: 'Help me write and edit ', mode: 'normal' },
  { text: 'Look something up', icon: Globe, prompt: 'Look up and summarize: ', mode: 'deep-research' },
];

export default function ChatPage() {
  const { messages, chatMode, setInputDraft, setChatMode } = useChatStore();
  const { sendMessage, retry, isLoading } = useChat();
  const isEmpty = messages.length === 0;

  const modeConfig = CHAT_MODES[chatMode];

  return (
    /* Outer wrapper fills remaining height after TopBar */
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {isEmpty ? (
        /* ── Welcome / empty state (Gemini-style centered column) ── */
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Greeting */}
            <div className="mb-8 w-full">
              <MessageList messages={[]} isLoading={false} />
            </div>

            {/* Input Box */}
            <div className="w-full animate-slide-in-up">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </div>

            {/* Suggestion chips (below input, Gemini-style) */}
            <div className="w-full animate-slide-in-up mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(({ text, icon: Icon, prompt, mode }) => (
                <button
                  key={text}
                  disabled={isLoading}
                  onClick={() => {
                    setChatMode(mode);
                    setInputDraft(prompt);
                  }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2 text-sm text-zinc-300 hover:text-white transition-all disabled:opacity-40"
                >
                  <Icon size={15} className="text-zinc-400 flex-shrink-0" />
                  <span>{text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Active chat state ── */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} isLoading={isLoading} onRetry={retry} />
          </div>

          {/* Pinned input dock */}
          <div className="flex-shrink-0 px-3 sm:px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-5 border-t border-white/5 bg-transparent"
               style={{ paddingBottom: 'max(1rem, calc(1rem + env(safe-area-inset-bottom)))' }}>
            <div className="max-w-3xl mx-auto w-full">
              {/* Mode indicator */}
              {chatMode !== 'normal' && (
                <div className="mb-2 flex items-center gap-2 text-xs text-emerald-400 animate-slide-in-up">
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-semibold">
                    {modeConfig.icon} {modeConfig.name} Mode Active
                  </span>
                  <span className="text-zinc-500">{modeConfig.description}</span>
                </div>
              )}
              
              <ChatInput onSend={sendMessage} disabled={isLoading} />
              <p className="text-center mt-2 text-[9px] tracking-wide text-zinc-700 uppercase">
                NEXUS AI can make mistakes — verify important information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extra space on mobile so fixed bottom nav never hides content */}
      <div className="md:hidden h-16 flex-shrink-0" />
    </div>
  );
}
