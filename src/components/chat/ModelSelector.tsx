import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MODELS } from '../../types/models';
import { useChatStore } from '../../store/chatStore';

const PROVIDER_COLORS: Record<string, string> = {
  openai:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  anthropic: 'text-amber-400  bg-amber-500/10  border-amber-500/20',
  google:    'text-blue-400   bg-blue-500/10   border-blue-500/20',
};

export function ModelSelector() {
  const { activeModel, setModel } = useChatStore();
  const [open, setOpen] = useState(false);

  const current = MODELS.find(m => m.id === activeModel) ?? MODELS[0];

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white/5 hover:bg-white/8 rounded-xl border border-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 max-w-[200px] sm:max-w-none"
      >
        <span className="text-xs font-semibold text-zinc-200 truncate">{current.label}</span>
        <span className={`hidden sm:inline text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PROVIDER_COLORS[current.provider] ?? 'text-zinc-400 bg-white/5 border-white/10'}`}>
          {current.provider}
        </span>
        <ChevronDown
          size={12}
          className={`text-zinc-400 flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Invisible backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel — left-aligned, min-w, safe on mobile */}
          <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[220px] w-max max-w-[calc(100vw-2rem)] bg-[#111214]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 py-1.5 overflow-hidden animate-slide-in-up">
            <p className="px-3.5 pt-1 pb-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest border-b border-white/5">
              Choose Model
            </p>
            {MODELS.map(m => {
              const isActive = m.id === activeModel;
              return (
                <button
                  key={m.id}
                  onClick={() => { setModel(m.id); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-all duration-100 border-l-2 ${
                    isActive
                      ? 'bg-white/5 text-white border-emerald-500 font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PROVIDER_COLORS[m.provider] ?? 'text-zinc-500 bg-white/5 border-white/10'}`}>
                      {m.provider}
                    </span>
                    {isActive && <Check size={12} className="text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
