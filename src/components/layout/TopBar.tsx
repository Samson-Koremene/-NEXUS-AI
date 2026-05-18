import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, User, History, X, Cpu } from 'lucide-react';
import { ModelSelector } from '../chat/ModelSelector';
import { ApiKeyWarning } from '../ui/ApiKeyWarning';

interface TopBarProps {
  onHistoryToggle: () => void;
  historyOpen: boolean;
}

export function TopBar({ onHistoryToggle, historyOpen }: TopBarProps) {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/stats' },
    { name: 'AI Chat',    path: '/' },
    { name: 'Help',       path: '/docs' },
    { name: 'Account',    path: '/settings' },
  ];

  const currentPath = location.pathname;
  const activeTab = tabs.find(t => t.path === currentPath)?.name || 'AI Chat';

  return (
    <header className="flex flex-col bg-[#070809]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 w-full select-none flex-shrink-0">
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

        {/* Center tab nav — only md+ */}
        <nav className="hidden md:flex items-center bg-[#0d0e10]/80 border border-white/5 rounded-full px-1.5 py-1 gap-0.5 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`text-[10px] font-bold tracking-wide px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                activeTab === tab.name
                  ? 'bg-white/5 border border-white/5 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right utilities */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Theme toggle — sm+ */}
          <div className="hidden sm:flex items-center bg-[#0d0e10]/80 border border-white/5 rounded-full px-1.5 py-1 gap-0.5">
            <button
              onClick={() => setDarkMode(false)}
              className={`p-1 rounded-full transition-colors ${!darkMode ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Light mode"
            >
              <Sun size={13} />
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`p-1 rounded-full transition-colors ${darkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Dark mode"
            >
              <Moon size={13} />
            </button>
          </div>

          {/* Bell */}
          <button className="relative p-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors" title="Notifications">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </button>

          {/* Avatar */}
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:border-emerald-500/30 transition-all"
            title="Profile & Keys"
          >
            <User size={14} />
          </button>

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

      {/* API key warning banner */}
      <ApiKeyWarning />
    </header>
  );
}
