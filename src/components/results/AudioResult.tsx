import { Volume2 } from 'lucide-react';

export function AudioResult({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="mt-3 flex flex-col rounded-xl border border-white/5 p-3 bg-[#161719] shadow-md w-full max-w-full sm:max-w-md">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
        <Volume2 size={11} />
        <span>Audio Result</span>
      </div>
      <audio
        controls
        className="w-full h-9 rounded-lg outline-none"
        style={{ accentColor: '#10b981' }}
      >
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
