import type { Certification, EducationEntry } from '../types/content';

export const education: EducationEntry[] = [
  {
    degree: 'MSc Software Systems',
    institution: 'Kongu Engineering College',
    location: 'Erode',
    period: { start: '2021-08', end: '2026-05' },
    score: 'CGPA 8.5 / 10',
  },
  {
    degree: 'Higher Secondary Certificate',
    institution: 'Maharishi Vidya Mandir',
    period: { start: '2020-06', end: '2021-06' },
    score: '80%',
  },
  {
    degree: 'Secondary School Certificate',
    institution: 'SSM Central School',
    period: { start: '2018-06', end: '2019-06' },
    score: '76%',
  },
];

export const certifications: Certification[] = [
  { name: 'AWS Cloud Technical Essentials' },
  { name: 'Java Programming Fundamentals' },
  { name: 'Software Testing Foundation', issuer: 'Infosys Springboard' },
];
