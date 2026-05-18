import { Suspense, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { HistorySidebar } from './components/layout/HistorySidebar';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import DocsPage from './pages/DocsPage';

export default function App() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const toggleHistory = useCallback(() => setHistoryOpen(v => !v), []);
  const closeHistory  = useCallback(() => setHistoryOpen(false), []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <Router>
      {/* Full-height container that never overflows */}
      <div 
        onMouseMove={handleMouseMove}
        className="flex h-[100dvh] w-full bg-[#070809] text-zinc-300 overflow-hidden font-sans relative"
      >
        
        {/* Dynamic Animated Motion Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.25]">
          {/* Slowly moving diagonal grid scanning lines */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.09)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] animate-grid-scan" 
          />
          
          {/* Horizontal scanning pulse overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.05] to-transparent bg-[size:100%_500px] animate-grid-scan" />

          {/* Interactive Mouse Glow Trail */}
          <div 
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-70 hidden md:block"
            style={{
              background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.09), transparent 80%)`
            }}
          />

          {/* Drifting Emerald Orb */}
          <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-emerald-500/[0.14] blur-[130px] animate-nebula-1" />

          {/* Drifting Blue Orb */}
          <div className="absolute bottom-[20%] right-[15%] w-[550px] h-[550px] rounded-full bg-blue-500/[0.12] blur-[150px] animate-nebula-2" />

          {/* Drifting Purple Orb */}
          <div className="absolute bottom-[10%] left-[10%] w-[380px] h-[380px] rounded-full bg-purple-500/[0.1] blur-[110px] animate-nebula-1" style={{ animationDelay: '-8s' }} />
        </div>

        {/* Left icon rail — desktop only */}
        <Sidebar />

        {/* Centre column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
          <TopBar onHistoryToggle={toggleHistory} historyOpen={historyOpen} />

          {/* Row: main content + optional desktop history panel */}
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-hidden">
              <Suspense fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="w-7 h-7 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              }>
                <Routes>
                  <Route path="/"         element={<ChatPage />} />
                  <Route path="/stats"    element={<DashboardPage />} />
                  <Route path="/docs"     element={<DocsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*"         element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            {/* Desktop history sidebar — lg and above */}
            <aside className="hidden lg:flex flex-shrink-0">
              <HistorySidebar />
            </aside>
          </div>
        </div>

        {/* Mobile / tablet history drawer */}
        {historyOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in"
              onClick={closeHistory}
            />
            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] z-50 lg:hidden animate-slide-in-right shadow-2xl">
              <HistorySidebar onClose={closeHistory} />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}
