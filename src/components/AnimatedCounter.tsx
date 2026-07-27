import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  icon: Icon
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <div
      ref={containerRef}
      className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
    >
      {/* Top Subtle Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e5c178] via-[#c5a059] to-[#99732b] opacity-80 group-hover:opacity-100 transition-opacity"></div>

      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 text-[#99732b] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-300 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      )}

      <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0b132b] mb-1.5 tracking-tight">
        {prefix}
        <span className="text-gradient-gold">{count.toLocaleString('en-IN')}</span>
        {suffix}
      </div>

      <div className="font-outfit text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
        {label}
      </div>

      {sublabel && (
        <div className="font-outfit text-xs text-slate-500 font-medium">{sublabel}</div>
      )}
    </div>
  );
};
