import { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Cpu, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRetry?: () => void;
}

export function MessageList({ messages, isLoading, onRetry }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 text-center select-none animate-slide-in-up">
        {/* Subtle brand mark (Gemini-style, replaces the animated vortex) */}
        <div className="mb-5 flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-green-400/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5">
          <Sparkles size={20} strokeWidth={2} />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-medium text-zinc-100 mb-3 tracking-tight max-w-xl leading-tight">
          Good day! How can I assist you?
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 max-w-md leading-relaxed">
          Ask anything — from coding to creative writing, research to analysis.
        </p>
      </div>
    );
  }

  return (
    /* Scroll container — full height, pb clears the input dock + mobile nav */
    <div className="h-full overflow-y-auto scroll-smooth">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 pt-4 pb-6">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} onRetry={onRetry} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 mb-6 animate-slide-in-up">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu size={14} className="animate-pulse" />
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
