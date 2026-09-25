import { useEffect } from 'react';
import { getLenis, scrollToTarget, startSmoothScroll } from '../motion/smoothScroll';
import { useMediaQuery } from './useMediaQuery';

/**
 * Enables Lenis smooth scrolling while motion is allowed, and routes in-page
 * anchor links through it so navigation glides instead of jumping. With
 * reduced motion, native scrolling and anchors are left untouched.
 */
export function useSmoothScroll() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reduced) return;
    const stop = startSmoothScroll();

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = link ? decodeURIComponent(link.getAttribute('href')?.slice(1) ?? '') : '';
      const target = id ? document.getElementById(id) : null;
      if (!target || !getLenis()) return;

      event.preventDefault();
      if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
      // Wait a frame so an overlay closing on the same click (the mobile menu) can release the scroll lock.
      requestAnimationFrame(() => {
        scrollToTarget(id === 'home' ? 0 : target);
        // Move keyboard focus with the view where the target accepts it (e.g. the skip link's <main>).
        if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
      });
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      stop();
    };
  }, [reduced]);
}
