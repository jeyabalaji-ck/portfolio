import type { MinorProject, Project } from '../types/content';

export const projects: Project[] = [
  {
    id: 'inventory',
    title: 'Inventory Management System',
    category: 'Full-stack · Operations',
    summary:
      'An inventory management system for dairy products that tracks stock levels, production flow and product availability.',
    highlights: [
      'Inventory workflows covering stock levels, production flow and availability tracking.',
      'REST APIs built with Spring Boot and Spring Data JPA.',
      'React interface backed by PostgreSQL for reliable persistence.',
    ],
    stack: ['Java', 'Spring Boot', 'JPA', 'PostgreSQL', 'React'],
    repoUrl: 'https://github.com/jeyabalaji-ck/inventory-management-system',
    caseStudy: {
      problem: 'Keeping an accurate view of stock levels, production flow and product availability for dairy products.',
      contribution:
        'Full-stack implementation: REST APIs with Spring Boot and Spring Data JPA, PostgreSQL persistence and the React interface on top.',
    },
  },
  {
    id: 'employee',
    title: 'Employee Management System',
    category: 'Full-stack · Admin',
    summary:
      'An admin application for managing employees and departments, with secured APIs and tooling for working with large datasets.',
    highlights: [
      'Employee and department CRUD APIs secured with JWT authentication and role-based access.',
      'Search, filtering, pagination and sorting for large employee datasets.',
      'React frontend connected to Spring Boot APIs for a responsive admin experience.',
    ],
    stack: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'React', 'JWT'],
    repoUrl: 'https://github.com/jeyabalaji-ck/employee-management-system',
    caseStudy: {
      problem: 'Managing employees and departments securely, and staying usable as the dataset grows.',
      contribution:
        'Employee and department CRUD APIs secured with JWT and role-based access, plus search, filtering, pagination and sorting surfaced in a React admin frontend.',
    },
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Management Platform',
    category: 'Full-stack · Commerce',
    summary:
      'Customer and admin workflows for a commerce platform - product catalog, cart and order management - with secured, validated APIs.',
    highlights: [
      'REST APIs for product catalog, cart and order management across customer and admin roles.',
      'JWT authentication, role-based access control, request validation, centralized exception handling and pagination.',
      'React / Redux Toolkit frontend on Spring Boot and PostgreSQL, containerized with Docker for consistent environments.',
    ],
    stack: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'JWT',
      'JPA',
      'PostgreSQL',
      'React',
      'Redux Toolkit',
      'Docker',
    ],
    caseStudy: {
      problem: 'Customer and admin workflows - catalog, cart and orders - that need secured, validated APIs.',
      contribution:
        'REST APIs with JWT authentication, role-based access control, request validation and centralized exception handling, a React / Redux Toolkit frontend, and Docker for consistent environments.',
    },
  },
  {
    id: 'saffron',
    title: 'Revolutionizing Saffron Cultivation Using Aeroponics',
    category: 'IoT · Smart Agriculture',
    summary:
      'An aeroponics-based cultivation approach that uses controlled environmental and nutrient conditions to support saffron growth outside its native climate.',
    highlights: [
      'Controlled environmental conditions and nutrient management for aeroponic growth.',
      'Automation-driven smart agriculture approach built around IoT.',
      'Presented at Smart India Hackathon 2024, where it received prize recognition for innovation and feasibility.',
    ],
    stack: ['IoT', 'Smart Agriculture', 'Automation'],
    recognition: 'Prize recognition · Smart India Hackathon 2024',
    caseStudy: {
      problem: 'Growing saffron outside its native climate.',
      contribution:
        'An automation-driven, IoT-based approach to controlling environmental conditions and nutrient delivery for aeroponic growth.',
      result: 'Presented at Smart India Hackathon 2024 and received prize recognition for innovation and feasibility.',
    },
  },
];

export const additionalWork: MinorProject[] = [
  {
    title: 'Research - CO₂ vehicle emissions',
    description:
      'Prediction and optimization of CO₂ vehicle emissions using Deep Q-Learning and a PSO model.',
    period: { start: '2025-04', end: '2026-04' },
  },
  {
    title: 'Multi-Language Translator using Ollama GenAI',
    description:
      'Real-time multilingual text translation with Ollama and large language models, including REST API integration, JSON processing and error handling.',
    period: { start: '2024-09', end: '2024-09' },
  },
  {
    title: 'Code to Logic Generator',
    description: 'Hackathon build delivered under pressure within a limited timeframe.',
    period: { start: '2024-04', end: '2024-04' },
  },
  {
    title: 'IoT Device Management',
    description:
      'Workflows for managing IoT devices such as smart streetlights, with real-time telemetry integration.',
    period: { start: '2023-04', end: '2023-04' },
  },
];
