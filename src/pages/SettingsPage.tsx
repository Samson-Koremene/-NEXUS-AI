import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Key, Eye, EyeOff, Trash2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { userEnteredKeys, setKey, removeKey } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const providers = [
    { id: 'openai', label: 'OpenAI API Key', desc: 'Required for GPT models, DALL-E 3, and TTS', envKey: 'VITE_OPENAI_API_KEY' },
    { id: 'anthropic', label: 'Anthropic API Key', desc: 'Required for Claude models. Note: Requires CORS proxy for browser use.', envKey: 'VITE_ANTHROPIC_API_KEY' },
    { id: 'google', label: 'Google AI API Key', desc: 'Required for Gemini models', envKey: 'VITE_GOOGLE_AI_API_KEY' },
    { id: 'serper', label: 'Serper API Key', desc: 'Required for Web Search functionality', envKey: 'VITE_SERPER_API_KEY' },
    { id: 'judge0', label: 'Judge0 RapidAPI Key', desc: 'Required for Code Execution', envKey: 'VITE_JUDGE0_API_KEY' },
  ];

  const toggleShow = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-2xl mx-auto p-5 pt-8 h-full overflow-y-auto select-none bg-transparent text-zinc-300 font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide font-sans">
          <Key size={18} className="text-zinc-400" />
          API Configuration
        </h1>
        <p className="text-xs text-zinc-500 mt-2 font-normal leading-relaxed">
          Enter your API keys to use the various models and tools. Keys are stored locally in your browser's localStorage. If keys are predefined in environment variables, they will be used automatically.
        </p>
      </div>

      <div className="space-y-4">
        {providers.map(provider => {
          const hasUserEntered = !!userEnteredKeys[provider.id];
          const hasEnvConfigured = !!import.meta.env[provider.envKey];
          
          return (
            <div key={provider.id} className="bg-[#161719] p-4.5 rounded-xl border border-white/5 shadow-md shadow-black/15">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <label htmlFor={provider.id} className="block text-xs font-semibold text-white tracking-wide">
                    {provider.label}
                  </label>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-normal leading-relaxed">{provider.desc}</p>
                </div>
                {hasEnvConfigured && !hasUserEntered && (
                  <Badge variant="success" className="flex items-center gap-1 py-0.5 px-2 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 uppercase tracking-wider">
                    <CheckCircle size={10} />
                    Active via Env
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={provider.id}
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    placeholder={hasEnvConfigured ? "Using predefined environment key..." : `Enter ${provider.label}...`}
                    value={userEnteredKeys[provider.id] || ''}
                    onChange={(e) => setKey(provider.id, e.target.value)}
                    className="pr-10 bg-[#0f1012] border-white/10 hover:border-white/20 text-white rounded-lg text-xs placeholder-zinc-600 focus:ring-1 focus:ring-white/20 focus:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(provider.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    disabled={!hasUserEntered}
                  >
                    {showKeys[provider.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeKey(provider.id)}
                  disabled={!hasUserEntered}
                  title="Clear key"
                  className="text-zinc-500 hover:text-red-400 hover:bg-white/5 border border-white/5 rounded-lg h-9 w-9 flex items-center justify-center transition-all duration-150"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
