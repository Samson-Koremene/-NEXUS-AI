
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../store/chatStore';
import { Image, Pencil, Globe } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'Create an image',     icon: Image },
  { text: 'Write or edit',       icon: Pencil },
  { text: 'Look something up',   icon: Globe },
];

export default function ChatPage() {
  const { messages } = useChatStore();
  const { sendMessage, isLoading } = useChat();
  const isEmpty = messages.length === 0;

  return (
    /* Outer wrapper fills remaining height after TopBar */
    <div className="flex flex-col h-full bg-transparent overflow-hidden">

      {isEmpty ? (
        /* ── Welcome / empty state ── */
        <div className="flex-1 flex flex-col items-center justify-end md:justify-center overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-8">
          {/* Dynamic top spacer (hidden on desktop where items are vertically centered) */}
          <div className="flex-grow min-h-[8vh] md:hidden" />

          <div className="w-full max-w-2xl flex flex-col justify-end md:justify-center md:items-center">
            {/* Desktop Greeting (hidden on mobile to keep bottom widgets clear) */}
            <div className="hidden md:block mb-8 w-full">
              <MessageList messages={[]} isLoading={false} />
            </div>

            {/* Suggestions (Above Input Box) */}
            <div className="w-full animate-slide-in-up mb-5 px-1 sm:px-2">
              <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2.5 md:gap-2">
                {SUGGESTIONS.map(({ text, icon: Icon }) => (
                  <button
                    key={text}
                    disabled={isLoading}
                    onClick={() => sendMessage(text)}
                    className="flex items-center gap-3.5 md:gap-1.5 py-3 md:py-1.5 px-2 md:px-3 bg-transparent md:bg-[#0d0e10] hover:bg-white/[0.02] md:hover:bg-[#161719] md:border md:border-white/5 rounded-xl md:rounded-full text-zinc-300 md:text-zinc-400 hover:text-white transition-all text-[14px] md:text-[10px] font-semibold md:font-medium tracking-wide disabled:opacity-40 text-left w-full md:w-auto"
                  >
                    <Icon size={16} className="text-zinc-400 md:text-zinc-500 flex-shrink-0" />
                    <span>{text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full animate-slide-in-up">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      ) : (
        /* ── Active chat state ── */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} isLoading={isLoading} />
          </div>

          {/* Pinned input dock */}
          <div className="flex-shrink-0 px-3 sm:px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-5 border-t border-white/5 bg-transparent"
               style={{ paddingBottom: 'max(1rem, calc(1rem + env(safe-area-inset-bottom)))' }}>
            <div className="max-w-3xl mx-auto w-full">
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
