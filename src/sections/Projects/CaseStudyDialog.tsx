import { useEffect, useRef, type ReactNode } from 'react';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { Icon } from '../../components/ui/Icon';
import { TagList } from '../../components/ui/Tag';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { Project } from '../../types/content';
import { ProjectVisual } from './ProjectVisual';
import styles from './CaseStudyDialog.module.scss';

interface CaseStudyDialogProps {
  project: Project | null;
  index: number;
  total: number;
  onClose: () => void;
}

const pad = (value: number) => String(value).padStart(2, '0');

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.label}>{label}</h3>
      <div className={styles.blockBody}>{children}</div>
    </div>
  );
}

/**
 * A modal case study built on the native <dialog>: focus is trapped and
 * restored by the browser, Escape closes it, and clicking the backdrop does
 * too. Only facts already documented for the project are shown; sections
 * without real information are left out rather than filled in.
 */
export function CaseStudyDialog({ project, index, total, onClose }: CaseStudyDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useScrollLock(Boolean(project));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      // Browsers restore focus on close only if the trigger had focus (Safari does not focus
      // buttons on click), so remember the project's case study button explicitly.
      returnFocus.current = document.querySelector<HTMLElement>(`[data-case-study="${project.id}"]`);
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!project) {
      if (dialog.open) dialog.close();
      if (returnFocus.current && document.activeElement === document.body) {
        returnFocus.current.focus({ preventScroll: true });
      }
      returnFocus.current = null;
    }
  }, [project]);

  const result = project?.caseStudy?.result ?? project?.recognition;

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="case-study-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      {project ? (
        <article className={styles.panel}>
          <div className={styles.top}>
            <p className={styles.counter}>
              <span className={styles.number}>
                Case study {pad(index + 1)} / {pad(total)}
              </span>
              <span>{project.category}</span>
            </p>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close case study" autoFocus>
              <Icon name="close" size={20} />
            </button>
          </div>

          <h2 id="case-study-title" className={styles.title}>
            {project.title}
          </h2>
          <p className={styles.summary}>{project.summary}</p>

          <div className={styles.visual}>
            <ProjectVisual projectId={project.id} />
          </div>

          <div className={styles.blocks}>
            {project.caseStudy ? (
              <Block label="Problem">
                <p>{project.caseStudy.problem}</p>
              </Block>
            ) : null}
            <Block label="Solution">
              <ul className={styles.points}>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </Block>
            <Block label="Technologies">
              <TagList items={project.stack} label={`${project.title} technologies`} size="md" />
            </Block>
            {project.caseStudy ? (
              <Block label="Key contribution">
                <p>{project.caseStudy.contribution}</p>
              </Block>
            ) : null}
            {result ? (
              <Block label="Result">
                <p className={styles.result}>
                  <Icon name="award" size={18} />
                  {result}
                </p>
              </Block>
            ) : null}
          </div>

          {project.repoUrl ? (
            <div className={styles.links}>
              <ButtonLink href={project.repoUrl} icon="github" iconLeading external cursorLabel="GitHub ↗">
                View source on GitHub
              </ButtonLink>
            </div>
          ) : null}
        </article>
      ) : null}
    </dialog>
  );
}
