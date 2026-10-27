import { useEffect } from 'react';

/**
 * BeyondArtist 2.2 Scroll Reveal Hook
 * Observes elements with `.reveal`, `.reveal-left`, `.reveal-right`, and `.reveal-fade` classes
 * and triggers smooth, subtle transitions when entering the viewport.
 * Includes fail-safe fallbacks to guarantee no content remains permanently hidden.
 */
export function useScrollReveal(deps: any[] = []): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-fade';

    // If user prefers reduced motion or browser lacks IntersectionObserver, reveal immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Immediately reveal any elements already in or above the visible viewport
    const revealIfVisible = (el: Element): boolean => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= windowHeight * 0.95 && rect.bottom >= 0) {
        el.classList.add('is-revealed');
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;

          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          } else {
            // Only reset if element is completely far outside viewport (180px above or below)
            // This guarantees content inside the viewport NEVER vanishes or flickers!
            const isFarAbove = rect.bottom < -180;
            const isFarBelow = rect.top > windowHeight + 180;
            if (isFarAbove || isFarBelow) {
              entry.target.classList.remove('is-revealed');
            }
          }
        });
      },
      {
        rootMargin: '50px 0px 50px 0px',
        threshold: [0, 0.1]
      }
    );

    // Initial scan and observation of all reveal elements
    const elements = document.querySelectorAll(SELECTOR);
    elements.forEach((el) => {
      revealIfVisible(el);
      observer.observe(el);
    });

    // Secondary scan for newly rendered dynamic items (e.g. category filters, tab switches)
    const scanTimeoutId = setTimeout(() => {
      const pending = document.querySelectorAll(SELECTOR);
      pending.forEach((el) => {
        revealIfVisible(el);
        observer.observe(el);
      });
    }, 150);

    // Fail-safe: ensure elements in viewport are revealed during active fast scroll
    const onScrollOrResize = () => {
      const all = document.querySelectorAll(SELECTOR);
      all.forEach((el) => {
        revealIfVisible(el);
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      clearTimeout(scanTimeoutId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

