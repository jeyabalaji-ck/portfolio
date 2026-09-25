import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { gsap, media } from '../../motion/gsap';
import styles from './Cursor.module.scss';

const QUERY = `${media.pointer} and (forced-colors: none)`;
const INTERACTIVE = 'a, button, [role="button"], label, summary';
/** Text fields keep the native I-beam, so the arrow steps aside over them. */
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]';

/**
 * A single small arrow icon that replaces the system pointer on precise
 * pointers. Its tip is the hotspot, so it lands exactly where a click will.
 * Over interactive elements it tints and nudges slightly larger; elements can
 * set `data-cursor` to show a short label beside it. It never renders on touch
 * devices, with reduced motion or in forced-colors mode, where the system
 * cursor is kept.
 */
export function Cursor() {
  const enabled = useMediaQuery(QUERY);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pointer = root?.querySelector<HTMLElement>('[data-pointer]');
    const label = root?.querySelector<HTMLElement>('[data-label]');
    if (!enabled || !root || !pointer || !label) return;

    document.documentElement.classList.add('has-custom-cursor');
    // A short follow keeps the motion smooth without the tip drifting from the real pointer.
    const x = gsap.quickTo(pointer, 'x', { duration: 0.12, ease: 'power3.out' });
    const y = gsap.quickTo(pointer, 'y', { duration: 0.12, ease: 'power3.out' });
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        root.dataset.visible = 'true';
        gsap.set(pointer, { x: event.clientX, y: event.clientY });
      }
      x(event.clientX);
      y(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (target?.closest(TEXT_FIELD)) {
        root.dataset.state = 'text';
      } else if (labelled?.dataset.cursor) {
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
      gsap.killTweensOf(pointer);
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
      <span data-pointer className={styles.pointer}>
        <svg className={styles.icon} width="16" height="20" viewBox="0 0 16 20" focusable="false">
          <path d="M1.5 1.5v14.2l3.9-3.7 2.6 5.9 2.5-1.1-2.6-5.8h5.4z" />
        </svg>
        <span data-label className={styles.label} />
      </span>
    </div>
  );
}
