import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Plus, Trash2, Clock, X } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { useChatStore } from '../../store/chatStore';

interface HistorySidebarProps {
  onClose?: () => void;
}

function relativeDay(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff} days ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function HistorySidebar({ onClose }: HistorySidebarProps = {}) {
  const { sessions, deleteSession, refreshSessions } = useSession();
  const { setSession, currentSessionId } = useChatStore();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Re-read sessions whenever a new chat is saved
  useEffect(() => { refreshSessions(); }, [currentSessionId]);

  const goTo = (path: string) => {
    if (location.pathname !== path) navigate(path);
  };

  const handleResume = (session: any) => {
    setSession(session);
    goTo('/');
    onClose?.();
  };

  const handleNew = () => {
    setSession(null);
    goTo('/');
    onClose?.();
  };

  const handleDelete = (e: any, id: string, isCurrent: boolean) => {
    e.stopPropagation();
    if (!confirm('Delete this chat?')) return;
    deleteSession(id);
    if (isCurrent) setSession(null);
  };

  // Group sessions by relative day label
  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = relativeDay(s.updatedAt);
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="w-72 bg-[#0d0e10]/80 backdrop-blur-xl border-l border-white/5 flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
          <Clock size={12} className="text-zinc-500" />
          History
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNew}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-semibold tracking-wide transition-all active:scale-95"
          >
            <Plus size={11} />
            New
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
              <MessageSquare size={20} className="text-zinc-700" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">No chats yet</p>
              <p className="text-[10px] text-zinc-700 mt-0.5">Your conversations will appear here</p>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="space-y-1">
              <p className="text-[9px] font-bold tracking-widest text-zinc-700 uppercase px-2 mb-1">{label}</p>
              {items.map(session => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleResume(session)}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isCurrent
                        ? 'bg-emerald-500/[0.04] border-emerald-500/20 text-white'
                        : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] hover:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-6">
                      <MessageSquare
                        size={12}
                        className={`flex-shrink-0 ${isCurrent ? 'text-emerald-400' : 'text-zinc-700'}`}
                      />
                      <span className="text-[11px] font-medium truncate">{session.title || 'Untitled'}</span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, session.id, isCurrent)}
                      title="Delete"
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
