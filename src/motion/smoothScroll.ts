import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so scroll position and
 * ScrollTrigger animations update in the same frame. Lenis only smooths wheel
 * input: touch devices keep native momentum scrolling, and it never runs with
 * reduced motion (see useSmoothScroll).
 */
let lenis: Lenis | null = null;
let locks = 0;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A long, soft landing for programmatic scrolls such as navigation links. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

export function getLenis(): Lenis | null {
  return lenis;
}

/** Starts smooth scrolling and returns a teardown. Safe to call once per mount. */
export function startSmoothScroll(): () => void {
  if (lenis) return () => undefined;

  const instance = new Lenis({ autoRaf: false, lerp: 0.11, smoothWheel: true, anchors: false });
  const onTick = (time: number) => instance.raf(time * 1000);

  instance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(onTick);
  // Lenis already smooths; GSAP's lag compensation would make scroll-linked tweens jump.
  gsap.ticker.lagSmoothing(0);
  lenis = instance;
  if (locks > 0) instance.stop();

  return () => {
    gsap.ticker.remove(onTick);
    gsap.ticker.lagSmoothing(500, 33);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/** Scrolls to an element or offset, smoothly unless motion is reduced. */
export function scrollToTarget(target: HTMLElement | number, { immediate = false } = {}) {
  const instant = immediate || reducedMotion();

  if (lenis) {
    const instance = lenis;
    instance.scrollTo(target, {
      immediate: instant,
      force: true,
      duration: 1.4,
      easing: easeOutExpo,
      // Content can change height during the glide (e.g. data loading in); land exactly on the target.
      onComplete: () => {
        if (typeof target !== 'number') instance.scrollTo(target, { immediate: true, force: true });
      },
    });
    return;
  }

  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
}

/**
 * Prevents the page from scrolling while an overlay (menu, dialog) is open.
 * Calls are counted, so nested overlays release the page only when all close.
 */
export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  lenis?.stop();
  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks > 0) return;
  lenis?.start();
  document.documentElement.classList.remove('scroll-locked');
}
