import { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Cpu } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-slide-in-up">
        {/* Rotating vortex orb + Release Patterns */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-6 flex items-center justify-center">
          
          {/* 1. Pulsing Concentric Expansion Shockwaves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            {/* Shockwave Glow 1 */}
            <div className="absolute w-14 h-14 rounded-full border border-emerald-500/20 bg-emerald-500/[0.02] blur-[1px] animate-release-wave-1" />
            {/* Shockwave Glow 2 */}
            <div className="absolute w-14 h-14 rounded-full border border-blue-500/10 bg-blue-500/[0.01] blur-[1px] animate-release-wave-2" />
            
            {/* Tech Cyber Ring 1 (Dashed) */}
            <div className="absolute w-14 h-14 rounded-full border border-dashed border-emerald-400/30 animate-release-tech-1" />
            {/* Tech Cyber Ring 2 (Double solid thin) */}
            <div className="absolute w-14 h-14 rounded-full border-2 border-double border-blue-400/20 animate-release-tech-2" style={{ animationDuration: '4.5s' }} />
          </div>

          {/* 2. Starburst Tech Particle Release Wave 1 (Emerald Sparks) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '0px', '--p-y': '-65px' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '45px', '--p-y': '-45px', 'animationDelay': '0.4s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '65px', '--p-y': '0px', 'animationDelay': '0.8s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '45px', '--p-y': '45px', 'animationDelay': '1.2s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '0px', '--p-y': '65px', 'animationDelay': '1.6s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-45px', '--p-y': '45px', 'animationDelay': '2.0s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-65px', '--p-y': '0px', 'animationDelay': '2.4s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-45px', '--p-y': '-45px', 'animationDelay': '2.8s' } as React.CSSProperties} />
          </div>

          {/* 3. Starburst Tech Particle Release Wave 2 (Blue Sparks) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="absolute w-1 h-1 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '25px', '--p-y': '-55px', 'animationDelay': '0.2s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '55px', '--p-y': '-25px', 'animationDelay': '0.6s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '55px', '--p-y': '25px', 'animationDelay': '1.0s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '25px', '--p-y': '55px', 'animationDelay': '1.4s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-25px', '--p-y': '55px', 'animationDelay': '1.8s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-55px', '--p-y': '25px', 'animationDelay': '2.2s' } as React.CSSProperties} />
            <div className="absolute w-1 h-1 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-55px', '--p-y': '-25px', 'animationDelay': '2.6s' } as React.CSSProperties} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/80 blur-[0.5px] animate-release-particle" style={{ '--p-x': '-25px', '--p-y': '-55px', 'animationDelay': '3.0s' } as React.CSSProperties} />
          </div>

          {/* Main Central Vortex Core */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-xl shadow-emerald-500/5 animate-vortex z-10">
            <div className="absolute inset-1 rounded-full border border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 opacity-80 blur-[2px]" />
            <Cpu size={16} className="text-white absolute" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 tracking-wide max-w-sm leading-snug">
          Good day! How can I assist you?
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-600 max-w-xs leading-relaxed">
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
          <MessageBubble key={message.id} message={message} />
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
