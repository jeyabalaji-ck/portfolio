import { Icon } from '../../components/ui/Icon';
import { Section } from '../../components/ui/Section';
import { services } from '../../data/services';
import styles from './Services.module.scss';

const pad = (value: number) => String(value).padStart(2, '0');

export function Services() {
  return (
    <Section
      index="08"
      id="services"
      eyebrow="Capabilities"
      title="What I *build*."
      intro="The kinds of frontend work I take on - from a single responsive screen to a shared component system."
    >
      <ol role="list" className={styles.list} data-reveal="stagger">
        {services.map((service, index) => (
          <li key={service.title} className={styles.item}>
            <span className={styles.index} aria-hidden="true">
              {pad(index + 1)}
            </span>
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>
            <Icon name="arrowUpRight" size={24} className={styles.arrow} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
