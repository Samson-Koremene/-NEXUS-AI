import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Message } from '../../types/chat';
import { ImageResult }  from '../results/ImageResult';
import { CodeResult }   from '../results/CodeResult';
import { SearchResult } from '../results/SearchResult';
import { AudioResult }  from '../results/AudioResult';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Share2, Download, RotateCw } from 'lucide-react';

export function MessageBubble({ message }: { message: Message }) {
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
      <div className={`flex max-w-[92%] sm:max-w-[85%] md:max-w-[80%] items-start gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
          isUser
            ? 'bg-zinc-800/40 border-white/5 text-zinc-400'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10'
        }`}>
          {isUser ? <User size={12} /> : <Bot size={12} className="animate-pulse" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Bubble */}
          <div className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all text-xs sm:text-sm leading-relaxed break-words w-full ${
            isUser
              ? 'bg-gradient-to-r from-emerald-500/10 to-amber-500/5 border border-emerald-500/15 rounded-tr-sm shadow-md shadow-emerald-950/5'
              : 'border rounded-tl-sm shadow-sm'
          }`}
          style={isUser ? { color: 'var(--text-primary)' } : { background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
          >
            {message.content && (
              <div className="prose prose-sm max-w-none dark:prose-invert font-sans leading-relaxed">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Specialist results */}
            {message.specialistResult && (
              <div className="mt-3">
                {message.resultType === 'image'  && <ImageResult  url={message.specialistResult as string} />}
                {message.resultType === 'audio'  && <AudioResult  url={message.specialistResult as string} />}
                {message.resultType === 'code'   && <CodeResult   {...(message.specialistResult as any)} />}
                {message.resultType === 'search' && <SearchResult results={message.specialistResult as any} />}
              </div>
            )}
          </div>

          {/* Meta row — timestamp + AI actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 px-1">
            <span className="text-[9px] font-medium tracking-wider text-zinc-700 uppercase select-none">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {!isUser && (
              <div className="flex items-center gap-2 sm:gap-2.5 text-zinc-600">
                <button onClick={handleCopy} title="Copy" className="hover:text-zinc-400 active:scale-90 transition-all p-0.5">
                  <Copy size={11} className={copied ? 'text-emerald-400' : ''} />
                </button>
                <button title="Like"     className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><ThumbsUp   size={11} /></button>
                <button title="Dislike"  className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><ThumbsDown size={11} /></button>
                <button title="Share"    className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><Share2     size={11} /></button>
                <button title="Download" className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><Download   size={11} /></button>
                <button title="Retry"    className="hover:text-zinc-400 active:scale-90 transition-all p-0.5"><RotateCw   size={11} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
