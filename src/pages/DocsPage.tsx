import { useState } from 'react';
import { Terminal, Keyboard, Sparkles, Code, ChevronRight } from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('features');

  const shortcuts = [
    { keys: ['Enter'], desc: 'Send current message' },
    { keys: ['Shift', 'Enter'], desc: 'Insert new line in textarea' },
    { keys: ['Esc'], desc: 'Close active sidebar or modal drawer' },
    { keys: ['Ctrl', '/'], desc: 'Toggle keyboard shortcuts guide' },
  ];

  const curlExample = `curl -X POST "https://api.nexus-ai.io/v1/chat" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3-flash",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-zinc-300 p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Rail */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-wider mb-2 px-3">Documentation</h2>
          {[
            { id: 'features', label: 'Core Features', icon: Sparkles },
            { id: 'api', label: 'Developer API', icon: Code },
            { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                  activeSection === sec.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-md shadow-emerald-500/5'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} />
                  <span>{sec.label}</span>
                </div>
                <ChevronRight size={12} className={activeSection === sec.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 bg-[#0d0e10] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20">
          {activeSection === 'features' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Core Abstractions</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Learn what NEXUS AI can do</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1">Deep Reasoning Mode</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                    Leverages full chain-of-thought processing steps to analyze complex code architectures, mathematical algorithms, and strategic puzzles before replying.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1">DALL-E 3 Image Generation</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                    Generate production-ready digital artwork and responsive illustrations directly in-chat by prefixing prompts with <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-400">Create an image of</code>.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1">Autonomous Web Search</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                    Retrieves relevant search indexes and real-time page summaries via the Google AI and Serper backends to bypass training constraints.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1">Speech Recognition</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                    Hands-free voice chat mode backed by dynamic Web Speech API filters. Toggle with the microphone icon to convert speech to natural text.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                  <Terminal size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">REST API Integration</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Use NEXUS endpoints anywhere</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                  All active LLMs and tool states can be automated using our robust web socket and REST interface. Simply authenticate with your secure API key:
                </p>
                <div className="p-4 bg-[#070809] border border-white/5 rounded-xl font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {curlExample}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                  <Keyboard size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Keyboard Navigation</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Enhance your productivity</p>
                </div>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5 bg-white/[0.01]">
                {shortcuts.map((sh) => (
                  <div key={sh.desc} className="flex items-center justify-between p-3.5 text-xs font-medium">
                    <span className="text-zinc-400">{sh.desc}</span>
                    <div className="flex gap-1.5">
                      {sh.keys.map((k) => (
                        <kbd key={k} className="px-2 py-1 bg-[#070809] border border-white/10 rounded text-[10px] font-black uppercase text-zinc-300 font-mono shadow-sm">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
