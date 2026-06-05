import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { gsap, media } from '../../motion/gsap';
import styles from './Cursor.module.scss';

const QUERY = `${media.pointer} and (forced-colors: none)`;
const INTERACTIVE = 'a, button, [role="button"], label, summary';

/**
 * A two-part cursor for precise pointers: a dot that tracks the pointer
 * exactly and a ring that trails it. Elements can set `data-cursor` to show a
 * short label. It never renders on touch devices, with reduced motion or in
 * forced-colors mode, where the system cursor is kept.
 */
export function Cursor() {
  const enabled = useMediaQuery(QUERY);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = root?.querySelector<HTMLElement>('[data-dot]');
    const ring = root?.querySelector<HTMLElement>('[data-ring]');
    const label = root?.querySelector<HTMLElement>('[data-label]');
    if (!enabled || !root || !dot || !ring || !label) return;

    document.documentElement.classList.add('has-custom-cursor');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        root.dataset.visible = 'true';
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled?.dataset.cursor) {
        label.textContent = labelled.dataset.cursor;
        root.dataset.state = 'label';
      } else {
        root.dataset.state = target?.closest(INTERACTIVE) ? 'link' : 'default';
      }
    };

    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      visible = false;
      root.dataset.visible = 'false';
    };
    const onDown = () => {
      root.dataset.pressed = 'true';
    };
    const onUp = () => {
      root.dataset.pressed = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={styles.cursor}
      aria-hidden="true"
      data-state="default"
      data-visible="false"
    >
      <span data-dot className={styles.dot} />
      <span data-ring className={styles.ring}>
        <span className={styles.shape} />
        <span data-label className={styles.label} />
      </span>
    </div>
  );
}
