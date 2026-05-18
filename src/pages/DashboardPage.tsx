import { BarChart3, TrendingUp, Cpu, Zap, Activity, Clock } from 'lucide-react';

export default function DashboardPage() {
  const metrics = [
    { label: 'Total Queries', value: '3,842', change: '+12%', icon: BarChart3, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Avg Latency', value: '185ms', change: '-4%', icon: Clock, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'API Success Rate', value: '99.96%', change: 'Stable', icon: Activity, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Total Tokens', value: '1.24M', change: '+24%', icon: Zap, color: 'text-amber-400 bg-amber-500/10' },
  ];

  const modelsUsage = [
    { name: 'Gemini 3 Flash', usage: 68, color: 'bg-emerald-500' },
    { name: 'GPT-4o / DALL-E 3', usage: 22, color: 'bg-blue-500' },
    { name: 'Claude 3.5 Sonnet', usage: 10, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-zinc-300 p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Cpu size={22} className="text-emerald-400 animate-pulse" />
            System Analytics
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
            Real-time diagnostics, performance logs, and token allocation details for the NEXUS AI instance.
          </p>
        </div>

        {/* Diagnostic Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-[#0d0e10] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${m.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    m.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' :
                    m.change.startsWith('-') ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-zinc-500'
                  }`}>
                    {m.change}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{m.label}</span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1 tracking-tight">{m.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lower Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Usage Chart card */}
          <div className="md:col-span-2 bg-[#0d0e10] border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Query Intensity</h3>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-400" />
                  Live 24h Interval
                </span>
              </div>
              
              {/* Mock Bar Chart using pure tailwind */}
              <div className="h-32 flex items-end justify-between gap-2.5 pt-4 border-b border-white/5">
                {[45, 60, 25, 80, 55, 90, 70, 40, 85, 65, 100, 75].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div 
                      style={{ height: `${val}%` }} 
                      className="w-full bg-gradient-to-t from-emerald-500/40 to-emerald-400/80 rounded-t-sm group-hover:from-emerald-400 group-hover:to-green-300 transition-all duration-200 cursor-pointer relative"
                    >
                      {/* Tooltip on hover */}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-zinc-950 text-[8px] font-black px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                        {val * 12}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-[10px] text-zinc-500 font-semibold px-1">
              <span>12:00 AM</span>
              <span>08:00 AM</span>
              <span>04:00 PM</span>
              <span>12:00 PM</span>
            </div>
          </div>

          {/* Model Allocation */}
          <div className="bg-[#0d0e10] border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Model Distribution</h3>
              
              <div className="space-y-4">
                {modelsUsage.map((m) => (
                  <div key={m.name} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-zinc-300">{m.name}</span>
                      <span className="text-white">{m.usage}%</span>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.usage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Active Agent Pools</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
