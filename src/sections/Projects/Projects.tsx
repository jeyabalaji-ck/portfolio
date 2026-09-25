import { useCallback, useRef, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { projects } from '../../data/projects';
import { AdditionalWork } from './AdditionalWork';
import { CaseStudyDialog } from './CaseStudyDialog';
import { GitHubActivity } from './GitHubActivity';
import { ProjectCard } from './ProjectCard';
import { useProjectsMotion } from './useProjectsMotion';
import styles from './Projects.module.scss';

const pad = (value: number) => String(value).padStart(2, '0');

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  useProjectsMotion(ref);

  const openIndex = projects.findIndex((project) => project.id === openId);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <Section
      index="05"
      id="projects"
      eyebrow="Work"
      title="Selected *work*."
      intro="Full-stack builds that pair React frontends with Spring Boot APIs, plus prize-recognised smart agriculture work from Smart India Hackathon 2024."
      headerClassName={styles.sectionHeader}
      after={
        <>
          {projects.length > 0 ? (
            <div ref={ref} className={styles.gallery}>
              <div className={styles.pin} data-work-pin>
                <div className={`container ${styles.hud}`} aria-hidden="true">
                  <span className={styles.hudHint}>Scroll to move through the work →</span>
                  <span className={styles.hudTrack}>
                    <span className={styles.hudFill} data-work-progress />
                  </span>
                  <span className={styles.hudCounter}>
                    <span data-work-current>01</span> / {pad(projects.length)}
                  </span>
                </div>

                <ol role="list" className={styles.track} data-work-track>
                  {projects.map((project, index) => (
                    <li key={project.id} className={styles.slide} data-work-slide>
                      <ProjectCard
                        project={project}
                        index={index}
                        total={projects.length}
                        onOpen={() => setOpenId(project.id)}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <p className={`container ${styles.empty}`}>Project case studies are being prepared - check back soon.</p>
          )}

          <div className="container">
            <AdditionalWork />
            <GitHubActivity />
          </div>

          <CaseStudyDialog
            project={projects[openIndex] ?? null}
            index={openIndex}
            total={projects.length}
            onClose={close}
          />
        </>
      }
    />
  );
}
