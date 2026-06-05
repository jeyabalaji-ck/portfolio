import { useRef, type CSSProperties } from 'react';
import { Section } from '../../components/ui/Section';
import { projects } from '../../data/projects';
import { AdditionalWork } from './AdditionalWork';
import { ProjectCard } from './ProjectCard';
import { useProjectsMotion } from './useProjectsMotion';
import styles from './Projects.module.scss';

export function Projects() {
  const ref = useRef<HTMLOListElement>(null);
  useProjectsMotion(ref);

  return (
    <Section
      index="04"
      id="projects"
      eyebrow="Projects"
      title="Selected *work*."
      intro="Full-stack builds that pair React frontends with Spring Boot APIs, plus prize-recognised smart agriculture work from Smart India Hackathon 2024."
    >
      {projects.length > 0 ? (
        <ol ref={ref} role="list" className={styles.stack}>
          {projects.map((project, index) => (
            <li
              key={project.id}
              className={styles.slot}
              style={{ '--i': index } as CSSProperties}
              data-project-slot
            >
              <ProjectCard project={project} index={index} total={projects.length} />
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>Project case studies are being prepared - check back soon.</p>
      )}
      <AdditionalWork />
    </Section>
  );
}
