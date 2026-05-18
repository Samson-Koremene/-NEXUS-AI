import { useState } from 'react';
import { Terminal, Copy } from 'lucide-react';

interface CodeResultProps { code: string; language: string; output: string; }

export function CodeResult({ code, language, output }: CodeResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code || output || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="mt-3 flex flex-col rounded-xl border border-white/5 overflow-hidden shadow-lg bg-[#08090f] w-full">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5 select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 font-mono">
            <Terminal size={11} />
            <span>{language || 'terminal'}</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          title="Copy"
          className="text-zinc-600 hover:text-zinc-400 transition-colors p-0.5"
        >
          <Copy size={12} className={copied ? 'text-emerald-400' : ''} />
        </button>
      </div>
      {/* Output */}
      <div className="overflow-x-auto font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed p-3 sm:p-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
        {output || 'No output.'}
      </div>
    </div>
  );
}
