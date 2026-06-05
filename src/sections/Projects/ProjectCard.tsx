import { ButtonLink } from '../../components/ui/ButtonLink';
import { Icon } from '../../components/ui/Icon';
import { SplitText } from '../../components/ui/SplitText';
import { TagList } from '../../components/ui/Tag';
import type { Project } from '../../types/content';
import { ProjectVisual } from './ProjectVisual';
import styles from './Projects.module.scss';

interface ProjectCardProps {
  project: Project;
  /** Zero-based position, shown as a counter. */
  index?: number;
  total?: number;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function ProjectCard({ project, index = 0, total = 1 }: ProjectCardProps) {
  const headingId = `project-${project.id}`;
  const visual = <ProjectVisual projectId={project.id} />;

  return (
    <article className={styles.card} aria-labelledby={headingId} data-project-card>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.counter}>
            <span className={styles.number}>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{project.category}</span>
          </p>
          <h3 id={headingId} className={styles.title} data-reveal="words">
            <SplitText text={project.title} />
          </h3>
          {project.recognition ? (
            <p className={styles.recognition}>
              <Icon name="award" size={16} />
              {project.recognition}
            </p>
          ) : null}
        </header>

        <p className={styles.summary}>{project.summary}</p>

        <ul className={styles.highlights}>
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <footer className={styles.footer}>
          <TagList items={project.stack} label={`${project.title} technologies`} />
          {project.repoUrl ? (
            <ButtonLink
              href={project.repoUrl}
              variant="secondary"
              icon="github"
              iconLeading
              external
              cursorLabel="GitHub ↗"
              className={styles.repo}
            >
              View on GitHub<span className="visually-hidden">: {project.title}</span>
            </ButtonLink>
          ) : null}
        </footer>
      </div>

      {/* The visual repeats the GitHub link for pointer users only; keyboard and screen reader users get the button above. */}
      {project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className={styles.visualLink}
          data-cursor="View project"
        >
          {visual}
        </a>
      ) : (
        <div className={styles.visualLink} aria-hidden="true">
          {visual}
        </div>
      )}
    </article>
  );
}
