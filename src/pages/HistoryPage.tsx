
import { useNavigate } from 'react-router-dom';
import { History, MessageSquare, Trash2 } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { useChatStore } from '../store/chatStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MODELS } from '../types/models';

export default function HistoryPage() {
  const { sessions, deleteSession } = useSession();
  const { setSession, currentSessionId } = useChatStore();
  const navigate = useNavigate();

  const handleResume = (session: any) => {
    setSession(session);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-10 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <History size={24} className="text-indigo-500" />
          Chat History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your previous conversations. Sessions are stored locally.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No history yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Start a conversation to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const modelConfig = MODELS.find(m => m.id === session.model);
            const isCurrent = session.id === currentSessionId;
            
            return (
              <div 
                key={session.id} 
                className={`p-5 rounded-xl border ${
                  isCurrent 
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800' 
                    : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                } transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="flex-1 cursor-pointer" onClick={() => handleResume(session)}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{session.title}</h3>
                    {isCurrent && <Badge variant="success">Current</Badge>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {session.messages.filter(m => m.role === 'user').length} queries
                    </span>
                    <span>Model: {modelConfig?.label || session.model}</span>
                    <span>Last active: {new Date(session.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isCurrent ? "secondary" : "primary"} 
                    onClick={() => handleResume(session)}
                  >
                    Resume
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this session?')) {
                        deleteSession(session.id);
                        if (isCurrent) setSession(null);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
