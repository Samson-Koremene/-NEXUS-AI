
import { Image as ImageIcon } from 'lucide-react';

export function ImageResult({ url, alt = 'Generated image' }: { url: string; alt?: string }) {
  if (!url) return null;
  return (
    <div className="mt-3 flex flex-col rounded-xl border border-white/5 overflow-hidden shadow-lg bg-[#161719] w-full max-w-full sm:max-w-sm">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex-shrink-0">
        <ImageIcon size={11} />
        <span>Generated Image</span>
      </div>
      <div className="overflow-hidden">
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}
