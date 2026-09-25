/**
 * Public GitHub data for the Work section, fetched in the browser from the
 * unauthenticated REST API. Results are cached for the session so repeat
 * visits stay well inside the anonymous rate limit; any failure surfaces as
 * an error so the UI can fall back to a plain profile link.
 */
const API = 'https://api.github.com';
const CACHE_MS = 30 * 60 * 1000;

interface RawUser {
  html_url: string;
  public_repos: number;
}

interface RawRepo {
  name: string;
  html_url: string;
  language: string | null;
  fork: boolean;
  archived?: boolean;
  pushed_at: string;
}

export interface LanguageShare {
  name: string;
  repos: number;
}

export interface RecentRepo {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
}

export interface GitHubSummary {
  profileUrl: string;
  publicRepos: number;
  languages: LanguageShare[];
  recent: RecentRepo[];
}

/** Turns raw API responses into what the UI shows. Forks are excluded throughout. */
export function summarizeGitHub(user: RawUser, repos: RawRepo[], recentCount = 4): GitHubSummary {
  const own = repos.filter((repo) => !repo.fork);

  const counts = new Map<string, number>();
  for (const repo of own) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const languages = [...counts]
    .map(([name, count]) => ({ name, repos: count }))
    .sort((a, b) => b.repos - a.repos || a.name.localeCompare(b.name))
    .slice(0, 5);

  const recent = [...own]
    .filter((repo) => !repo.archived)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, recentCount)
    .map((repo) => ({ name: repo.name, url: repo.html_url, language: repo.language, pushedAt: repo.pushed_at }));

  return { profileUrl: user.html_url, publicRepos: user.public_repos, languages, recent };
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
  return (await response.json()) as T;
}

function readCache(key: string): GitHubSummary | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: GitHubSummary };
    return Date.now() - at < CACHE_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: GitHubSummary) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Caching is optional.
  }
}

export async function fetchGitHubSummary(username: string, signal?: AbortSignal): Promise<GitHubSummary> {
  const key = `github:${username}`;
  const cached = readCache(key);
  if (cached) return cached;

  const [user, repos] = await Promise.all([
    getJson<RawUser>(`${API}/users/${encodeURIComponent(username)}`, signal),
    getJson<RawRepo[]>(`${API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`, signal),
  ]);
  const summary = summarizeGitHub(user, repos);
  writeCache(key, summary);
  return summary;
}
