import { describe, expect, it } from 'vitest';
import { summarizeGitHub } from './githubApi';

const repo = (name: string, language: string | null, pushed: string, extra: object = {}) => ({
  name,
  html_url: `https://github.com/example/${name}`,
  language,
  fork: false,
  pushed_at: pushed,
  ...extra,
});

describe('summarizeGitHub', () => {
  const user = { html_url: 'https://github.com/example', public_repos: 5 };
  const repos = [
    repo('old-java', 'Java', '2024-01-01T00:00:00Z'),
    repo('site', 'TypeScript', '2026-09-01T00:00:00Z'),
    repo('api', 'Java', '2026-08-01T00:00:00Z'),
    repo('forked', 'Go', '2026-09-20T00:00:00Z', { fork: true }),
    repo('notes', null, '2025-01-01T00:00:00Z'),
  ];

  it('counts languages across own repositories only, most used first', () => {
    const { languages } = summarizeGitHub(user, repos);
    expect(languages).toEqual([
      { name: 'Java', repos: 2 },
      { name: 'TypeScript', repos: 1 },
    ]);
  });

  it('lists the most recently pushed own repositories', () => {
    const { recent, publicRepos, profileUrl } = summarizeGitHub(user, repos, 2);
    expect(recent.map((item) => item.name)).toEqual(['site', 'api']);
    expect(publicRepos).toBe(5);
    expect(profileUrl).toBe('https://github.com/example');
  });
});
