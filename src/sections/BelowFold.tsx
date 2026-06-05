import { useEffect } from 'react';
import { ScrollTrigger } from '../motion/gsap';
import { Achievements } from './Achievements/Achievements';
import { Approach } from './Approach/Approach';
import { Contact } from './Contact/Contact';
import { Education } from './Education/Education';
import { Experience } from './Experience/Experience';
import { Expertise } from './Expertise/Expertise';
import { Projects } from './Projects/Projects';
import { Skills } from './Skills/Skills';

/**
 * Sections below the first screen, loaded as a separate chunk so the hero and
 * about content render without waiting for them.
 */
export default function BelowFold() {
  // Trigger positions measured before this chunk mounted are now stale. The
  // browser also tried to resolve a URL hash before these sections existed, so
  // deep links such as /#projects are honoured once measurements are fresh.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Experience />
      <Expertise />
      <Projects />
      <Skills />
      <Approach />
      <Achievements />
      <Education />
      <Contact />
    </>
  );
}
