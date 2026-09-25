import type { StackCategory } from '../types/content';

/**
 * The interactive tech stack. Every note describes how the technology is used
 * in the experience and projects listed elsewhere in this folder.
 */
export const stackCategories: StackCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    summary:
      'Component-driven interfaces built with functional components and hooks, designed to be reused across products and screens.',
    items: [
      { name: 'React.js', note: 'The core of my day-to-day work: hotel booking, extranet and backoffice interfaces built from functional components and hooks.' },
      { name: 'TypeScript', note: 'Typed props, state and API responses, so components behave predictably across screens and microfrontends.' },
      { name: 'JavaScript', note: 'Modern JavaScript underneath everything I ship - the language I reach for first.' },
      { name: 'HTML', note: 'Semantic, accessible markup as the foundation of every interface.' },
      { name: 'CSS / SCSS', note: 'Responsive, cross-browser layouts - this portfolio is styled with SCSS modules and design tokens.' },
    ],
  },
  {
    id: 'state',
    title: 'State & Data',
    summary:
      'Predictable application and server state with Redux Toolkit and RTK Query, backed by clean REST API integration.',
    items: [
      { name: 'Redux Toolkit', note: 'Shared application state with predictable updates, kept separate from local UI concerns.' },
      { name: 'RTK Query', note: 'Server data with caching and invalidation, keeping API data and UI state in sync under frequent updates.' },
      { name: 'REST APIs', note: 'Integrations that power hotel search, booking workflows, cancellation policies and reporting.' },
      { name: 'Axios', note: 'HTTP clients with consistent request and response handling.' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend / Other',
    summary:
      'Working backend knowledge from full-stack projects, which makes API integrations cleaner and debugging faster.',
    items: [
      { name: 'Java', note: 'The language behind my full-stack projects’ services.' },
      { name: 'Spring Boot', note: 'REST APIs with JWT authentication, role-based access, validation and JPA persistence.' },
      { name: 'Node.js', note: 'JavaScript on the server - this portfolio’s contact API runs on Express and Nodemailer.' },
      { name: 'MongoDB', note: 'Document storage, alongside PostgreSQL and MySQL in my backend toolkit.' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps / Tools',
    summary: 'Typed, reviewed code delivered through CI/CD pipelines inside Agile teams.',
    items: [
      { name: 'Git', note: 'Branching, pull requests and code reviews as part of everyday team delivery.' },
      { name: 'Jenkins', note: 'CI/CD pipelines for production deployments.' },
      { name: 'Docker', note: 'Containerised environments - used to keep the e-commerce platform consistent across machines.' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    summary: 'Confidence before shipping: tests around core functionality and a structured approach to quality.',
    items: [
      { name: 'Jest', note: 'Unit tests guarding core functionality, part of reducing production defects.' },
      { name: 'Software Testing', note: 'Software Testing Foundation certification (Infosys Springboard), with JUnit and Mockito on the backend.' },
    ],
  },
];

/** Technologies for the scrolling marquee. */
export const marqueeItems = [
  'React',
  'TypeScript',
  'JavaScript',
  'Redux',
  'RTK Query',
  'HTML',
  'SCSS',
  'Jest',
  'Java',
  'Spring Boot',
  'Docker',
  'Jenkins',
];
