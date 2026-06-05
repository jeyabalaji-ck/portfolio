import type { NavItem, Profile } from '../types/content';

export const profile: Profile = {
  name: 'Jeya Balaji C K',
  shortName: 'Jeya Balaji',
  role: 'Software Engineer - Frontend',
  headline: 'Building scalable, responsive and thoughtful web experiences.',
  summary:
    'Software developer specializing in React.js, Redux Toolkit, TypeScript and modern JavaScript - building production web applications with clean state management, reliable API integration and a steady focus on performance.',
  email: 'jeyabalajichandrasekaran@gmail.com',
  location: 'Namakkal, Tamil Nadu, India',
  currentBase: 'Bangalore, India',
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      handle: 'jeyabalaji-ck',
      href: 'https://github.com/jeyabalaji-ck',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'in/jeyabalaji-ck',
      href: 'https://www.linkedin.com/in/jeyabalaji-ck',
    },
    {
      id: 'leetcode',
      label: 'LeetCode',
      handle: 'u/jeyabalaji-ck',
      href: 'https://leetcode.com/u/jeyabalaji-ck',
    },
  ],
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
