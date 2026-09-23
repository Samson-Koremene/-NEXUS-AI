import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import type { Message, CodeResultData } from '../../types/chat';
import type { SearchResultItem } from '../../lib/searchService';
import { ImageResult }  from '../results/ImageResult';
import { CodeResult }   from '../results/CodeResult';
import { SearchResult } from '../results/SearchResult';
import { AudioResult }  from '../results/AudioResult';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Share2, Download, RotateCw } from 'lucide-react';

export function MessageBubble({ message, onRetry }: { message: Message; onRetry?: () => void }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={`flex w-full mb-6 sm:mb-7 animate-slide-in-up select-text ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse max-w-[85%] sm:max-w-[75%]' : 'flex-row w-full'}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
          isUser
            ? 'bg-zinc-800/40 border-white/5 text-zinc-400'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10'
        }`}>
          {isUser ? <User size={12} /> : <Bot size={12} className="animate-pulse" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start flex-1'}`}>
          {/* Bubble — user keeps a compact chat bubble; assistant renders flat & spacious like ChatGPT */}
          <div className={`transition-all break-words ${
            isUser
              ? 'px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm leading-relaxed bg-gradient-to-r from-emerald-500/10 to-amber-500/5 border border-emerald-500/15 shadow-md shadow-emerald-950/5'
              : 'w-full px-0.5'
          }`}
          style={isUser ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}
          >
            {message.content && (
              <div className={isUser
                ? 'prose prose-sm max-w-none dark:prose-invert font-sans leading-relaxed'
                : 'nexus-prose font-sans'
              }>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Specialist results */}
            {message.specialistResult != null && (() => {
              const r: NonNullable<Message['specialistResult']> = message.specialistResult!;
              if (message.resultType === 'image' && typeof r === 'string')
                return <div className="mt-4"><ImageResult url={r} /></div>;
              if (message.resultType === 'audio' && typeof r === 'string')
                return <div className="mt-4"><AudioResult url={r} /></div>;
              if (message.resultType === 'code' && typeof r === 'object' && r !== null && !Array.isArray(r)) {
                const c = r as CodeResultData;
                return <div className="mt-4"><CodeResult code={c.code} language={c.language ?? 'code'} output={c.output} /></div>;
              }
              if (message.resultType === 'search' && Array.isArray(r))
                return <div className="mt-4"><SearchResult results={r as SearchResultItem[]} /></div>;
              return null;
            })()}

            {/* Retry affordance for failed responses */}
            {message.isError && (
              <button
                onClick={onRetry}
                disabled={!onRetry}
                aria-label="Try again"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/15 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <RotateCw size={12} /> Try again
              </button>
            )}
          </div>

          {/* Meta row — timestamp + AI actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 px-1">
            <span className="text-[9px] font-medium tracking-wider text-zinc-700 uppercase select-none">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {!isUser && (
              <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-600">
                <button onClick={handleCopy} title="Copy" aria-label="Copy message" className="hover:text-zinc-400 active:scale-90 transition-all p-0.5">
                  <Copy size={11} className={copied ? 'text-emerald-400' : ''} />
                </button>
                <button title="Like"    aria-label="Good response"  className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><ThumbsUp   size={11} /></button>
                <button title="Dislike" aria-label="Bad response"   className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><ThumbsDown size={11} /></button>
                <button title="Share"   aria-label="Share message"  className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><Share2     size={11} /></button>
                <button title="Download" aria-label="Download message" className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><Download   size={11} /></button>
                <button title="Retry"   aria-label="Retry response" onClick={onRetry} className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><RotateCw   size={11} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
