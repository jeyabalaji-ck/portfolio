import { useEffect } from 'react';
import { ScrollTrigger } from '../motion/gsap';
import { scrollToTarget } from '../motion/smoothScroll';
import { Achievements } from './Achievements/Achievements';
import { Contact } from './Contact/Contact';
import { Education } from './Education/Education';
import { Experience } from './Experience/Experience';
import { Process } from './Process/Process';
import { Projects } from './Projects/Projects';
import { Services } from './Services/Services';
import { Stack } from './Stack/Stack';

/** Section ids from earlier versions of the site, so old deep links still land somewhere sensible. */
const legacyIds: Record<string, string> = { skills: 'stack', expertise: 'stack', approach: 'process' };

/**
 * Sections below the first screen, loaded as a separate chunk so the hero and
 * about content render without waiting for them.
 */
export default function BelowFold() {
  // Trigger positions measured before this chunk mounted are now stale, and the
  // pinned gallery changes the height of everything after it: sort triggers by
  // their place in the document, then measure again. The browser also tried to
  // resolve a URL hash before these sections existed, so deep links such as
  // /#projects are honoured once measurements are fresh.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const id = legacyIds[hash] ?? hash;
      const target = id ? document.getElementById(id) : null;
      if (target) scrollToTarget(target, { immediate: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Experience />
      <Stack />
      <Process />
      <Projects />
      <Achievements />
      <Education />
      <Services />
      <Contact />
    </>
  );
}
