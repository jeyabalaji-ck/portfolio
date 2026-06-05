import { lazy, Suspense } from 'react';
import { Footer } from './components/layout/Footer';
import { Cursor } from './components/motion/Cursor';
import { Intro } from './components/motion/Intro';
import { Header } from './components/layout/Header';
import { SectionPlaceholder } from './components/ui/SectionPlaceholder';
import { About } from './sections/About/About';
import { Hero } from './sections/Hero/Hero';

const BelowFold = lazy(() => import('./sections/BelowFold'));

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
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
