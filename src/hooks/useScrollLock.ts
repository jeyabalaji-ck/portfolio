import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../motion/smoothScroll';

/** Locks page scrolling (native and smooth) while `locked` is true. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    return unlockScroll;
  }, [locked]);
}
