import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useChatStore } from '../../store/chatStore';
import { MODELS, ModelId } from '../../types/models';

export function ApiKeyWarning() {
  const { hasRequiredKeys } = useSettings();
  const { activeModel }     = useChatStore();
  const [dismissed, setDismissed] = useState(false);

  const model  = MODELS.find(m => m.id === activeModel);
  const hasKey = model ? hasRequiredKeys(activeModel as ModelId) : true;

  if (hasKey || dismissed || !model) return null;

  const envVar = `VITE_${model.provider.toUpperCase()}_API_KEY`;

  return (
    <div className="mx-3 sm:mx-4 mt-2 mb-1 px-3 py-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-2.5 animate-slide-in-up">
      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
      <p className="flex-1 text-[11px] text-zinc-400 leading-relaxed min-w-0 break-words">
        Add <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-[10px] text-amber-400">{envVar}</code> to your{' '}
        <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-[10px] text-amber-400">.env</code> file to use{' '}
        <strong className="text-zinc-200">{model.label}</strong>.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
