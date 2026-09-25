import { Icon } from '../../components/ui/Icon';
import { Section } from '../../components/ui/Section';
import { SocialLinks } from '../../components/ui/SocialLinks';
import { contactNextSteps } from '../../data/contact';
import { profile } from '../../data/profile';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useMagnetic } from '../../hooks/useMagnetic';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.scss';

const statusMessages = {
  idle: '',
  copied: 'Email address copied to clipboard.',
  error: 'Could not copy automatically - please copy the address manually.',
} as const;

export function Contact() {
  const { status, copy } = useCopyToClipboard();
  const emailRef = useMagnetic<HTMLAnchorElement>({ strength: 0.08, innerStrength: 0.04 });

  return (
    <Section
      index="09"
      id="contact"
      eyebrow="Contact"
      title="Let’s build something *great.*"
      intro={
        <>
          <span className={styles.available}>
            <span className={styles.pulse} aria-hidden="true" />
            Available for frontend / software engineering opportunities.
          </span>
          Hiring for a frontend role, planning a product or curious about my work? Send a message and I’ll reply
          personally.
        </>
      }
      className={styles.section}
      headerClassName={styles.header}
    >
      <div className={styles.glow} aria-hidden="true" data-parallax="-30" />

      <div className={styles.layout}>
        <div className={styles.primary} data-reveal="fade">
          <ContactForm />
        </div>

        <aside className={styles.aside} aria-label="Other ways to reach me" data-reveal="fade">
          <div className={styles.block}>
            <p className={styles.label}>Prefer email?</p>
            <a ref={emailRef} className={styles.email} href={`mailto:${profile.email}`} data-cursor="Let's talk">
              <span data-magnetic-inner>{profile.email}</span>
            </a>
            <button type="button" className={styles.copy} onClick={() => void copy(profile.email)}>
              <Icon name={status === 'copied' ? 'check' : 'copy'} size={15} />
              {status === 'copied' ? 'Copied' : 'Copy address'}
            </button>
            <p className={styles.status} role="status" aria-live="polite">
              {statusMessages[status]}
            </p>
            <p className={styles.location}>
              <Icon name="mapPin" size={16} />
              {profile.location} · working from {profile.currentBase}
            </p>
          </div>

          <div className={styles.block}>
            <p className={styles.label}>What happens next</p>
            <ol className={styles.steps} role="list">
              {contactNextSteps.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepText}>{step.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.block}>
            <p className={styles.label}>Profiles</p>
            <SocialLinks variant="detailed" />
          </div>
        </aside>
      </div>
    </Section>
  );
}
