import { Search, ExternalLink } from 'lucide-react';
import { SearchResultItem } from '../../lib/searchService';

export function SearchResult({ results }: { results: SearchResultItem[] }) {
  if (!results?.length) return null;

  return (
    <div className="mt-3 flex flex-col gap-2.5 w-full">
      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest select-none">
        <Search size={11} className="animate-pulse" />
        <span>Web Results</span>
      </div>

      {results.map((r, i) => (
        <a
          key={i}
          href={r.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-200 w-full"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors line-clamp-1 flex-1">
              {r.title}
            </span>
            <ExternalLink size={11} className="text-zinc-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-1.5">{r.snippet}</p>
          <p className="text-[10px] text-zinc-600 font-mono truncate">{r.link}</p>
        </a>
      ))}
    </div>
  );
}
