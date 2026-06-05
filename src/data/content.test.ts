import { describe, expect, it } from 'vitest';
import { experience } from './experience';
import { profile } from './profile';
import { projects } from './projects';

describe('portfolio content', () => {
  it('links project repositories to their exact GitHub URLs', () => {
    const repoById = Object.fromEntries(projects.map((project) => [project.id, project.repoUrl]));

    expect(repoById.inventory).toBe('https://github.com/jeyabalaji-ck/inventory-management-system');
    expect(repoById.employee).toBe('https://github.com/jeyabalaji-ck/employee-management-system');
    expect(repoById.ecommerce).toBeUndefined();
    expect(repoById.saffron).toBeUndefined();
  });

  it('uses direct, secure profile links rather than search URLs', () => {
    const urls = [...profile.socials.map((social) => social.href), ...projects.map((p) => p.repoUrl)]
      .filter((url): url is string => Boolean(url));

    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toMatch(/search|google\./i);
    }
    expect(profile.socials.find((social) => social.id === 'github')?.href).toBe(
      'https://github.com/jeyabalaji-ck',
    );
  });

  it('lists experience newest first with valid ISO months', () => {
    const starts = experience.map((role) => role.period.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    for (const start of starts) expect(start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });

  it('gives every project a unique id', () => {
    const ids = projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
