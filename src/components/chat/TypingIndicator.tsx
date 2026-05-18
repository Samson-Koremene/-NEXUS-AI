

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0d0e10] border border-white/[0.04] rounded-2xl rounded-tl-sm w-fit shadow-sm">
      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot" />
      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot" />
      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full typing-dot" />
    </div>
  );
}
