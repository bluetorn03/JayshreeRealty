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

    // Fallback if browser lacks IntersectionObserver
    if (!('IntersectionObserver' in window)) {
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
        rootMargin: '100px 0px 100px 0px',
        threshold: [0, 0.05]
      }
    );

    // Initial scan and observation of all reveal elements
    const elements = document.querySelectorAll(SELECTOR);
    elements.forEach((el) => {
      revealIfVisible(el);
      observer.observe(el);
    });

    // Multi-stage scan for dynamic async database loads and tab transitions
    const t1 = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        revealIfVisible(el);
        observer.observe(el);
      });
    }, 100);

    const t2 = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        revealIfVisible(el);
        observer.observe(el);
      });
    }, 400);

    const t3 = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        revealIfVisible(el);
        observer.observe(el);
      });
    }, 1000);

    // Fail-safe: ensure elements in viewport are revealed during active fast scroll
    const onScrollOrResize = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        revealIfVisible(el);
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

