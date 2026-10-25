import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface FormattedDescriptionProps {
  text?: string;
  className?: string;
  isLight?: boolean;
}

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = '',
  isLight = false,
}) => {
  if (!text || typeof text !== 'string' || !text.trim()) return null;

  const lines = text.split(/\r?\n/);

  // Helper to get color classes based on color name and light/dark theme
  const getColorClass = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case 'gold':
        return isLight ? 'text-[#99732b] font-semibold' : 'text-[#e5c178] font-semibold';
      case 'emerald':
      case 'green':
        return isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400 font-semibold';
      case 'blue':
        return isLight ? 'text-blue-700 font-semibold' : 'text-blue-400 font-semibold';
      case 'red':
      case 'crimson':
        return isLight ? 'text-rose-700 font-semibold' : 'text-rose-400 font-semibold';
      case 'amber':
      case 'orange':
        return isLight ? 'text-amber-700 font-semibold' : 'text-amber-400 font-semibold';
      case 'purple':
      case 'violet':
        return isLight ? 'text-purple-700 font-semibold' : 'text-purple-400 font-semibold';
      case 'gray':
      case 'muted':
        return isLight ? 'text-slate-500' : 'text-slate-400';
      default:
        return isLight ? 'text-[#99732b] font-semibold' : 'text-[#e5c178] font-semibold';
    }
  };

  const parseInline = (content: string) => {
    // 1. Parse [color:COLOR_NAME]text[/color] tags
    const colorRegex = /(\[color:[a-zA-Z]+\][\s\S]*?\[\/color\])/g;
    const partsWithColor = content.split(colorRegex);

    return partsWithColor.map((chunk, chunkIdx) => {
      const match = chunk.match(/^\[color:([a-zA-Z]+)\]([\s\S]*?)\[\/color\]$/);
      if (match) {
        const colorName = match[1];
        const innerText = match[2];
        return (
          <span key={`col-${chunkIdx}`} className={getColorClass(colorName)}>
            {parseBasicInline(innerText)}
          </span>
        );
      }
      return <React.Fragment key={`txt-${chunkIdx}`}>{parseBasicInline(chunk)}</React.Fragment>;
    });
  };

  // Helper to parse **bold** and *italic*
  const parseBasicInline = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong
            key={i}
            className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em
            key={i}
            className={`italic ${isLight ? 'text-[#99732b]' : 'text-[#e5c178]'}`}
          >
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className={`space-y-2 font-outfit ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> clean paragraph break
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // H1 Heading (# Heading)
        if (trimmed.startsWith('# ')) {
          return (
            <h3
              key={idx}
              className={`font-serif text-lg md:text-xl font-bold pt-3 pb-1 border-b ${
                isLight ? 'text-slate-900 border-slate-200' : 'text-[#c5a059] border-slate-800'
              }`}
            >
              {parseInline(trimmed.substring(2))}
            </h3>
          );
        }

        // H2 Heading (## Heading)
        if (trimmed.startsWith('## ')) {
          return (
            <h4
              key={idx}
              className={`font-serif text-base md:text-lg font-bold pt-2 ${
                isLight ? 'text-amber-800' : 'text-[#c5a059]'
              }`}
            >
              {parseInline(trimmed.substring(3))}
            </h4>
          );
        }

        // H3 Heading (### Heading)
        if (trimmed.startsWith('### ')) {
          return (
            <h5
              key={idx}
              className={`font-serif text-sm md:text-base font-semibold pt-1.5 ${
                isLight ? 'text-amber-900 font-bold' : 'text-[#e5c178]'
              }`}
            >
              {parseInline(trimmed.substring(4))}
            </h5>
          );
        }

        // Bullet point (• or - or *)
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm pl-1">
              <span className="text-[#c5a059] font-bold mt-0.5">•</span>
              <span className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {parseInline(bulletContent)}
              </span>
            </div>
          );
        }

        // RERA Tag detection (e.g. RERA No: ... or Rera-PMI...)
        if (/^rera/i.test(trimmed)) {
          return (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold my-1 border ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-[#c5a059]/15 text-[#e5c178] border-[#c5a059]/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{trimmed}</span>
            </div>
          );
        }

        // Regular line with preserved enter break
        return (
          <p
            key={idx}
            className={`text-xs md:text-sm leading-relaxed ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};
