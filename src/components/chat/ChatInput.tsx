import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Paperclip, X, Mic, RefreshCw, Lightbulb, Monitor, Plus, ChevronRight, FileText, Image, Globe, Folder, Compass, MoreHorizontal } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText]                   = React.useState('');
  const [file, setFile]                   = React.useState<File | null>(null);
  const [listening, setListening]         = React.useState(false);
  const [menuOpen, setMenuOpen]           = React.useState(false);

  const { chatMode, setChatMode } = useChatStore();

  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRef    = useRef<any>(null);

  /* Auto-grow textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  /* Speech recognition */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous     = false;
    rec.interimResults = false;
    rec.lang           = 'en-US';
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      if (t) setText(prev => (prev ? `${prev} ${t}` : t));
    };
    speechRef.current = rec;
    return () => { try { rec.stop(); } catch (_) {} };
  }, []);

  const toggleMic = () => {
    if (!speechRef.current) {
      alert('Voice recognition requires Chrome or Edge.');
      return;
    }
    listening ? speechRef.current.stop() : speechRef.current.start();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
    e.target.value = '';
  };

  const reset = () => {
    setText('');
    setFile(null);
    setChatMode('normal');
  };

  const canSend = !disabled && (text.trim().length > 0 || !!file);

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;

    let payload = text.trim();
    if (file) payload = `${payload}\n\n[Attached: ${file.name}]`.trim();

    onSend(payload);
    setText('');
    setFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [canSend, text, file, onSend]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  /* Pill helper */
  const Pill = ({ active, onClick, icon: Icon, label }: {
    active: boolean; onClick: () => void; icon: React.ElementType; label: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
        active
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
      }`}
    >
      <Icon size={10} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <form
      onSubmit={submit}
      className="relative flex flex-col w-full bg-[#0d0e10]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-3 py-3 focus-within:border-emerald-500/20 transition-all duration-200 shadow-xl shadow-black/30"
    >
      <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" />

      {/* File chip */}
      {file && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300 mb-2 w-fit max-w-full animate-slide-in-up">
          <Paperclip size={10} className="text-zinc-500 flex-shrink-0" />
          <span className="truncate max-w-[160px] font-mono text-[10px]">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-zinc-500 hover:text-white p-0.5 rounded flex-shrink-0">
            <X size={9} />
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={file ? 'Add a message to this file…' : 'Ask a question or make a request…'}
        rows={1}
        disabled={disabled}
        className="w-full bg-transparent text-xs sm:text-sm resize-none focus:outline-none text-zinc-100 placeholder-zinc-600 overflow-y-auto font-sans leading-relaxed max-h-40 disabled:opacity-50"
      />

      {/* Bottom action row */}
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/[0.04]">
        {/* Left tools + mode pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => setMenuOpen(prev => !prev)}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                menuOpen ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title="Add actions"
            >
              <Plus size={13} className={`transition-transform duration-200 ${menuOpen ? 'rotate-45' : ''}`} />
            </button>

            {menuOpen && (
              <>
                {/* Overlay backdrop to close clicking outside */}
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMenuOpen(false)} />
                
                {/* Popup action menu */}
                <div className="absolute left-0 bottom-[calc(100%+12px)] z-50 w-56 bg-[#161719]/90 backdrop-blur-2xl border border-white/[0.1] shadow-2xl rounded-2xl p-1.5 flex flex-col gap-0.5 animate-slide-in-up origin-bottom-left">
                  {/* Add photos & files */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold text-left"
                  >
                    <Paperclip size={14} className="text-zinc-400" />
                    <span>Add photos & files</span>
                  </button>

                  {/* Recent files */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={14} className="text-zinc-400" />
                      <span>Recent files</span>
                    </div>
                    <ChevronRight size={11} className="text-zinc-600" />
                  </button>

                  <div className="h-px bg-white/5 my-1 mx-2" />

                  {/* Create image */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setText("Create an image of ");
                      textareaRef.current?.focus();
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold text-left"
                  >
                    <Image size={14} className="text-zinc-400" />
                    <span>Create image</span>
                  </button>

                  {/* Thinking */}
                  <button
                    type="button"
                    onClick={() => {
                      setChatMode(chatMode === 'reasoning' ? 'normal' : 'reasoning');
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all text-xs font-semibold ${
                      chatMode === 'reasoning' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Lightbulb size={14} className={chatMode === 'reasoning' ? 'text-emerald-400' : 'text-zinc-400'} />
                      <span>Reasoning Mode</span>
                    </div>
                    {chatMode === 'reasoning' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>

                  {/* Deep research */}
                  <button
                    type="button"
                    onClick={() => {
                      setChatMode(chatMode === 'deep-research' ? 'normal' : 'deep-research');
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all text-xs font-semibold ${
                      chatMode === 'deep-research' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass size={14} className={chatMode === 'deep-research' ? 'text-emerald-400' : 'text-zinc-400'} />
                      <span>Deep Research Mode</span>
                    </div>
                    {chatMode === 'deep-research' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>

                  {/* Web search */}
                  <button
                    type="button"
                    onClick={() => {
                      alert('Web search is enabled for all models!');
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold text-left"
                  >
                    <Globe size={14} className="text-zinc-400" />
                    <span>Web search</span>
                  </button>

                  {/* More */}
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <MoreHorizontal size={14} className="text-zinc-400" />
                      <span>More</span>
                    </div>
                    <ChevronRight size={11} className="text-zinc-600" />
                  </button>

                  <div className="h-px bg-white/5 my-1 mx-2" />

                  {/* Projects */}
                  <button
                    type="button"
                    onClick={() => {
                      alert('Projects folder feature coming soon!');
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder size={14} className="text-zinc-400" />
                      <span>Projects</span>
                    </div>
                    <ChevronRight size={11} className="text-zinc-600" />
                  </button>
                </div>
              </>
            )}
          </div>
          <button type="button" onClick={reset}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-all" title="Reset">
            <RefreshCw size={13} />
          </button>

          <div className="w-px h-3.5 bg-white/5 mx-0.5" />

          <Pill active={chatMode === 'reasoning'}    onClick={() => setChatMode(chatMode === 'reasoning' ? 'normal' : 'reasoning')}         icon={Lightbulb} label="Reasoning"     />
          <Pill active={chatMode === 'deep-research'} onClick={() => setChatMode(chatMode === 'deep-research' ? 'normal' : 'deep-research')}      icon={Monitor}   label="Deep Research" />
        </div>

        {/* Right: mic + send */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={toggleMic}
            title="Voice input"
            className={`p-1.5 rounded-lg transition-all ${listening ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
          >
            <Mic size={14} className={listening ? 'animate-pulse' : ''} />
          </button>

          <button
            type="submit"
            disabled={!canSend}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md ${
              canSend
                ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-zinc-950 hover:opacity-90 shadow-emerald-500/20'
                : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed shadow-none'
            }`}
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </form>
  );
}
