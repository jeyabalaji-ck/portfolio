import { Button } from '../../components/ui/Button';
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
  /** Opens the case study. When omitted, the case study action is not shown. */
  onOpen?: () => void;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function ProjectCard({ project, index = 0, total = 1, onOpen }: ProjectCardProps) {
  const headingId = `project-${project.id}`;

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
          <span className={styles.bigIndex} aria-hidden="true" data-project-index>
            {pad(index + 1)}
          </span>
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
          <div className={styles.actions}>
            {onOpen ? (
              <Button
                icon="arrowUpRight"
                onClick={onOpen}
                aria-haspopup="dialog"
                cursorLabel="Open"
                data-case-study={project.id}
              >
                Case study<span className="visually-hidden">: {project.title}</span>
              </Button>
            ) : null}
            {project.repoUrl ? (
              <ButtonLink
                href={project.repoUrl}
                variant="secondary"
                icon="github"
                iconLeading
                external
                cursorLabel="GitHub ↗"
              >
                View on GitHub<span className="visually-hidden">: {project.title}</span>
              </ButtonLink>
            ) : null}
          </div>
        </footer>
      </div>

      {/* Pointer shortcut to the case study; keyboard and screen reader users get the button above. */}
      <div
        className={styles.visualLink}
        aria-hidden="true"
        data-cursor={onOpen ? 'View case study' : undefined}
        onClick={onOpen}
      >
        <ProjectVisual projectId={project.id} />
      </div>
    </article>
  );
}
