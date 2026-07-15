import { History, X, Cpu, LogOut } from 'lucide-react';
import { ModelSelector } from '../chat/ModelSelector';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onHistoryToggle: () => void;
  historyOpen: boolean;
}

export function TopBar({ onHistoryToggle, historyOpen }: TopBarProps) {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <header className="flex flex-col backdrop-blur-xl border-b sticky top-0 z-30 w-full select-none flex-shrink-0 transition-colors duration-300"
      style={{ background: `color-mix(in srgb, var(--bg-primary) 80%, transparent)`, borderColor: 'var(--border-primary)' }}
    >
      <div className="h-14 px-3 sm:px-5 flex items-center gap-2">

        {/* Mobile brand logo (hidden on md+ where sidebar shows it) */}
        <div className="md:hidden w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0">
          <Cpu size={14} />
        </div>

        {/* Model selector */}
        <div className="flex-shrink-0 min-w-0">
          <ModelSelector />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* App title - center */}
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>NEXUS AI</h1>
        </div>

        <div className="flex-1" />

        {/* Right utilities */}
        <div className="flex items-center gap-1.5 flex-shrink-0">


          {/* User email display */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-zinc-400 max-w-[150px] truncate">
                {user.email}
              </span>
            </div>
          )}

          {/* Sign out */}
          {user && (
            <button
              onClick={handleSignOut}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          )}

          {/* History toggle — always visible */}
          <button
            onClick={onHistoryToggle}
            title={historyOpen ? 'Close history' : 'Chat history'}
            className={`p-2 rounded-xl border transition-all duration-150 ${
              historyOpen
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-[#0d0e10]/80 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {historyOpen ? <X size={15} /> : <History size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
