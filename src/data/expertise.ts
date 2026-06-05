import type { Capability, CapabilityNode } from '../types/content';

export const expertise: Capability[] = [
  {
    id: 'react',
    title: 'React Engineering',
    description:
      'Component-driven interfaces built with functional components and hooks, designed to be reused across products and screens.',
    items: [
      'React.js',
      'React Hooks',
      'Functional components',
      'Reusable component design',
      'Responsive UI',
      'Cross-browser compatibility',
    ],
  },
  {
    id: 'state',
    title: 'State & Data',
    description:
      'Predictable application and server state with Redux Toolkit and RTK Query, backed by clean REST API integration.',
    items: ['Redux Toolkit', 'RTK Query', 'REST APIs', 'Axios', 'JSON handling', 'Data fetching'],
  },
  {
    id: 'performance',
    title: 'Performance',
    description:
      'Faster loads and smoother rendering through lazy loading, leaner API calling patterns and careful rendering.',
    items: [
      'Lazy loading',
      'API call optimization',
      'Rendering performance',
      'Efficient data fetching',
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering Practice',
    description:
      'Typed, tested and reviewed code, delivered through CI/CD pipelines inside Agile teams.',
    items: [
      'TypeScript',
      'Jest unit testing',
      'Microfrontend architecture',
      'CI/CD with Jenkins',
      'Git & code reviews',
      'Agile / Scrum',
    ],
  },
];

/** Core technologies arranged around the expertise diagram, each tied to a capability above. */
export const expertiseNodes: CapabilityNode[] = [
  { label: 'React.js', capability: 'react' },
  { label: 'TypeScript', capability: 'engineering' },
  { label: 'Redux Toolkit', capability: 'state' },
  { label: 'RTK Query', capability: 'state' },
  { label: 'REST APIs', capability: 'state' },
  { label: 'Jest', capability: 'engineering' },
  { label: 'Microfrontends', capability: 'engineering' },
  { label: 'Performance', capability: 'performance' },
  { label: 'CI/CD', capability: 'engineering' },
];
