
import { NavLink } from 'react-router-dom';
import { MessageSquare, Cpu, LogOut, BarChart3, BookOpen, Globe } from 'lucide-react';

const NAV = [
  { to: '/',         icon: MessageSquare, label: 'Chat' },
  { to: '/stats',    icon: BarChart3,     label: 'Stats' },
  { to: '/docs',     icon: BookOpen,      label: 'Docs' },
  { to: '/settings', icon: Globe,         label: 'Web Keys' },
];

function NavIcon({
  to, icon: Icon, label, side,
}: { to: string; icon: React.ElementType; label: string; side: 'desktop' | 'mobile' }) {
  return (
    <NavLink
      to={to}
      title={label}
      onClick={(e) => to === '#' && e.preventDefault()}
      className={({ isActive }) => {
        const active = isActive && to !== '#';
        if (side === 'desktop') {
          return `w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-150 ${
            active
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-500/5'
              : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`;
        }
        return `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 ${
          active ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500'
        }`;
      }}
    >
      <Icon size={side === 'desktop' ? 16 : 18} />
      {side === 'mobile' && <span className="text-[9px] font-semibold tracking-wide leading-none">{label}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const handleSignOut = () => {
    if (confirm('Sign out of NEXUS AI?')) alert('Signed out.');
  };

  return (
    <>
      {/* ── Desktop: left icon rail ── */}
      <div className="hidden md:flex w-16 bg-[#0d0e10]/80 backdrop-blur-xl border-r border-white/5 flex-col items-center justify-between py-5 h-full z-20 select-none flex-shrink-0">
        {/* Logo */}
        <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/5 animate-pulse">
          <Cpu size={18} />
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-3">
          {NAV.map(item => <NavIcon key={item.label} {...item} side="desktop" />)}
        </nav>

        {/* Logout */}
        <button
          title="Sign out"
          onClick={handleSignOut}
          className="w-10 h-10 rounded-xl bg-transparent hover:bg-white/5 border border-transparent text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-all duration-150 active:scale-95"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* ── Mobile: fixed bottom nav bar ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0d0e10]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] select-none">
        {NAV.map(item => <NavIcon key={item.label} {...item} side="mobile" />)}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-zinc-500 hover:text-rose-400 transition-all duration-150"
        >
          <LogOut size={18} />
          <span className="text-[9px] font-semibold tracking-wide leading-none">Exit</span>
        </button>
      </div>
    </>
  );
}
