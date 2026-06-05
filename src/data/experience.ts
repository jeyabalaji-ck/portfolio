import type { Role } from '../types/content';

export const experience: Role[] = [
  {
    id: 'codemagen',
    company: 'CodeMagen Technologies',
    title: 'Software Engineer - UI',
    location: 'Bangalore',
    period: { start: '2025-04' },
    summary:
      'Frontend engineering for customer-facing travel and hotel booking applications, working closely with backend and product teams in an Agile/Scrum environment.',
    highlights: [
      {
        title: 'Hotels Booking & Extranet platform',
        points: [
          'Develop UI features that let partners manage listings, pricing, availability and policies.',
          'Integrate REST APIs that power hotel search, booking workflows, cancellation policies and reporting.',
          'Build backoffice/admin modules that help internal teams manage hotel data, configurations and operational workflows.',
        ],
      },
      {
        title: 'Frontend architecture',
        points: [
          'Develop scalable React.js applications with Redux Toolkit, TypeScript and React Hooks, using RTK Query to keep API data and UI state in sync under frequent updates.',
          'Implement reusable functional components with responsive design and cross-browser compatibility within a Microfrontend architecture, for both desktop and mobile.',
        ],
      },
      {
        title: 'Quality & delivery',
        points: [
          'Improved application performance by 25% and reduced production defects, with Jest unit tests guarding core functionality.',
          'Troubleshoot production and pre-release issues, optimize API calling patterns and improve frontend load and rendering performance.',
          'Contribute to CI/CD-based production deployments with Git and Jenkins, take part in code reviews and follow SDLC best practices.',
        ],
      },
    ],
    stack: [
      'React.js',
      'TypeScript',
      'Redux Toolkit',
      'RTK Query',
      'React Hooks',
      'REST APIs',
      'Jest',
      'Microfrontends',
      'Jenkins',
      'Git',
    ],
  },
  {
    id: 'schnell',
    company: 'Schnell Equipments',
    title: 'Full Stack Development Intern',
    location: 'Coimbatore',
    period: { start: '2024-07', end: '2024-09' },
    summary:
      'Contributed to Lume, a browser-based application for monitoring and controlling wireless streetlights in real time, deployed in a live production environment.',
    highlights: [
      {
        title: 'Lume - wireless streetlight monitoring',
        points: [
          'Built and refined web features for IoT device monitoring using REST APIs and JSON telemetry data.',
          'Implemented API consumption and telemetry data handling to support real-time monitoring and system optimization.',
          'Supported API integration, debugging and feature implementation as part of a live engineering team.',
        ],
      },
    ],
    stack: ['REST APIs', 'JSON', 'API Integration', 'IoT Telemetry', 'Debugging'],
  },
];
