import { useEffect, useState } from 'react';

/**
 * Reports whether the page is scrolled past `offset` and whether the latest
 * movement was downward. Updates are batched to one per animation frame.
 */
export function useScrollDirection(offset = 8, tolerance = 6) {
  const [state, setState] = useState({ scrolled: false, down: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < tolerance && y > offset) return;
      lastY = y;
      setState((current) => {
        const next = { scrolled: y > offset, down: delta > 0 && y > offset * 20 };
        return next.scrolled === current.scrolled && next.down === current.down ? current : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [offset, tolerance]);

  return state;
}
