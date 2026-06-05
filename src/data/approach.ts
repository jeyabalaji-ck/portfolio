import type { Principle } from '../types/content';

export const principles: Principle[] = [
  {
    title: 'Components as contracts',
    description:
      'Reusable functional components with clear, typed props, so the same building blocks behave consistently across screens and microfrontends.',
  },
  {
    title: 'State where it belongs',
    description:
      'Local state for local concerns, Redux Toolkit for shared application state and RTK Query for server data - caching and invalidation instead of hand-rolled fetching.',
  },
  {
    title: 'Performance is a feature',
    description:
      'Lazy loading, fewer and smarter API calls and careful rendering keep interfaces responsive under frequent data updates.',
  },
  {
    title: 'Confidence before shipping',
    description:
      'Jest tests around core functionality, code reviews and CI/CD pipelines, so changes reach production reliably.',
  },
  {
    title: 'Built for every screen',
    description:
      'Responsive layouts and cross-browser compatibility from the start, for desktop and mobile users alike.',
  },
  {
    title: 'Close to the API',
    description:
      'Understanding the backend - from REST contracts to Spring Boot services - makes integrations cleaner and debugging faster.',
  },
];
