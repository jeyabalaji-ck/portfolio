import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { Icon } from '../../components/ui/Icon';
import { profile } from '../../data/profile';
import { ScrollTrigger } from '../../motion/gsap';
import { fetchGitHubSummary, type GitHubSummary } from '../../services/githubApi';
import styles from './GitHubActivity.module.scss';

type State = { status: 'idle' | 'loading' | 'error' } | { status: 'ready'; data: GitHubSummary };

const github = profile.socials.find((social) => social.id === 'github');
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

/**
 * Live, public GitHub data: repository count, language mix and recently
 * updated repositories. It loads only when scrolled near, and falls back to a
 * plain profile link if the API is unavailable or rate limited.
 */
export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: 'idle' });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!github || !element) return;
    const controller = new AbortController();

    const load = () => {
      setState({ status: 'loading' });
      fetchGitHubSummary(github.handle, controller.signal)
        .then((data) => setState({ status: 'ready', data }))
        .catch(() => {
          if (!controller.signal.aborted) setState({ status: 'error' });
        });
    };

    if (typeof IntersectionObserver === 'undefined') {
      load();
      return () => controller.abort();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, []);

  // The block changes height when data arrives; everything measured below it must be re-measured.
  useEffect(() => {
    if (state.status !== 'ready' && state.status !== 'error') return;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [state.status]);

  if (!github) return null;

  const maxRepos = state.status === 'ready' ? (state.data.languages[0]?.repos ?? 1) : 1;

  return (
    <div ref={ref} className={styles.github} aria-busy={state.status === 'loading'}>
      <div className={styles.head}>
        <h3 className={styles.title}>Latest on GitHub</h3>
        <ButtonLink
          href={github.href}
          variant="secondary"
          icon="github"
          iconLeading
          external
          cursorLabel="GitHub ↗"
        >
          @{github.handle}
        </ButtonLink>
      </div>

      {state.status === 'ready' ? (
        <div className={styles.grid}>
          <div className={styles.summary}>
            <p className={styles.figure}>
              {state.data.publicRepos}
              <span className={styles.figureLabel}>public repositories</span>
            </p>

            {state.data.languages.length > 0 ? (
              <div>
                <p className={styles.label}>Languages across my own repositories</p>
                <ul role="list" className={styles.languages}>
                  {state.data.languages.map((language, index) => (
                    <li key={language.name} className={styles.language}>
                      <span className={styles.languageName}>{language.name}</span>
                      <span className={styles.bar} aria-hidden="true">
                        <span
                          className={index === 0 ? styles.barAccent : styles.barFill}
                          style={{ width: `${(language.repos / maxRepos) * 100}%` }}
                        />
                      </span>
                      <span className={styles.count}>
                        {language.repos} {language.repos === 1 ? 'repo' : 'repos'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div>
            <p className={styles.label}>Recently updated</p>
            <ul role="list" className={styles.repos}>
              {state.data.recent.map((repo) => (
                <li key={repo.name}>
                  <a className={styles.repo} href={repo.url} target="_blank" rel="noopener noreferrer" data-cursor="Repo ↗">
                    <span className={styles.repoName}>{repo.name}</span>
                    <span className={styles.repoMeta}>
                      {repo.language ? <span>{repo.language}</span> : null}
                      <time dateTime={repo.pushedAt}>Updated {monthFormatter.format(new Date(repo.pushedAt))}</time>
                    </span>
                    <Icon name="arrowUpRight" size={18} className={styles.repoArrow} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : state.status === 'error' ? (
        <p className={styles.fallback}>
          Live repository data from GitHub isn&apos;t available right now - browse my repositories directly on{' '}
          <a href={github.href} target="_blank" rel="noopener noreferrer">
            GitHub<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          .
        </p>
      ) : (
        <div className={styles.skeleton} role="status">
          <span />
          <span />
          <span />
          <span className="visually-hidden">Loading GitHub activity…</span>
        </div>
      )}
    </div>
  );
}
