export type SectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'stack'
  | 'process'
  | 'projects'
  | 'achievements'
  | 'education'
  | 'services'
  | 'contact';

export interface NavItem {
  id: SectionId;
  label: string;
}

export type SocialId = 'github' | 'linkedin' | 'leetcode';

export interface SocialLink {
  id: SocialId;
  label: string;
  handle: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  summary: string;
  email: string;
  location: string;
  currentBase: string;
  socials: SocialLink[];
}

/** A date range where `start`/`end` are ISO months (YYYY-MM); `end` is omitted for ongoing work. */
export interface Period {
  start: string;
  end?: string;
}

export interface HighlightGroup {
  title: string;
  points: string[];
}

export interface Role {
  id: string;
  company: string;
  title: string;
  location: string;
  period: Period;
  summary: string;
  highlights: HighlightGroup[];
  stack: string[];
}

export interface StackItem {
  name: string;
  /** One line on how the technology is used, drawn from real work and projects. */
  note: string;
}

export interface StackCategory {
  id: string;
  title: string;
  summary: string;
  items: StackItem[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  highlights: string[];
  stack: string[];
  repoUrl?: string;
  recognition?: string;
  /** Extra detail for the case study view. Only facts already documented for the project. */
  caseStudy?: {
    problem: string;
    contribution: string;
    result?: string;
  };
}

export interface MinorProject {
  title: string;
  description: string;
  period: Period;
}

export interface SkillGroup {
  id: string;
  title: string;
  note?: string;
  skills: string[];
}

export interface BuildStage {
  id: string;
  title: string;
  description: string;
  concepts: string[];
}

export interface Service {
  title: string;
  description: string;
}

export interface Achievement {
  /** What was achieved, e.g. "Prize recognition". */
  label: string;
  title: string;
  context: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location?: string;
  period: Period;
  score: string;
}

export interface Certification {
  name: string;
  issuer?: string;
}
