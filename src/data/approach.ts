import type { BuildStage } from '../types/content';

/** How I build frontend software, from first conversation to optimisation. */
export const buildStages: BuildStage[] = [
  {
    id: 'understand',
    title: 'Understand',
    description:
      'Start from the product and the people using it. Working closely with product and backend teams in Agile/Scrum, I pin down the workflows, the edge cases and the API contracts before any component exists.',
    concepts: ['Requirements', 'User workflows', 'API contracts'],
  },
  {
    id: 'architect',
    title: 'Architect',
    description:
      'Components as contracts: reusable functional components with clear, typed props. State where it belongs - local state for local concerns, Redux Toolkit for shared state and RTK Query for server data.',
    concepts: ['Reusable Components', 'State Management', 'Microfrontends'],
  },
  {
    id: 'build',
    title: 'Build',
    description:
      'Responsive layouts and cross-browser compatibility from the start, for desktop and mobile alike. Understanding the backend - from REST contracts to Spring Boot services - keeps integrations clean.',
    concepts: ['API Integration', 'Responsive Design', 'Accessibility'],
  },
  {
    id: 'optimize',
    title: 'Optimize',
    description:
      'Performance is a feature: lazy loading, fewer and smarter API calls and careful rendering. Jest tests, code reviews and CI/CD pipelines get changes to production reliably.',
    concepts: ['Performance', 'Testing', 'Code Quality'],
  },
];
