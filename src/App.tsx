import { lazy, Suspense } from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Cursor } from './components/motion/Cursor';
import { Intro } from './components/motion/Intro';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { SectionPlaceholder } from './components/ui/SectionPlaceholder';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { About } from './sections/About/About';
import { Hero } from './sections/Hero/Hero';

const BelowFold = lazy(() => import('./sections/BelowFold'));

function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Suspense fallback={<SectionPlaceholder />}>
          <BelowFold />
        </Suspense>
      </main>
      <Footer />
      <Cursor />
      <Intro />
    </>
  );
}

export default App;
