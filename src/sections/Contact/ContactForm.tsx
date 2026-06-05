import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { contactFormNote, contactPrivacyNote, contactTopics } from '../../data/contact';
import { profile } from '../../data/profile';
import { ContactApiError, sendContactMessage } from '../../services/contactApi';
import {
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from '../../utils/contactValidation';
import { cx } from '../../utils/cx';
import styles from './ContactForm.module.scss';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FieldName = keyof ContactFields;

const emptyValues: ContactFields = { name: '', email: '', company: '', topic: '', message: '' };
const fieldOrder: FieldName[] = ['name', 'email', 'company', 'topic', 'message'];

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
}

function Field({ id, label, error, hint, optional = false, className, children }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional ? <span className={styles.optional}>Optional</span> : null}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;
  const [values, setValues] = useState<ContactFields>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [alert, setAlert] = useState('');
  const [sentTo, setSentTo] = useState({ name: '', email: '', confirmationSent: false });
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const update =
    (field: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // Once a field has an error, re-check it as the visitor types so the message clears promptly.
      if (errors[field]) setErrors((current) => ({ ...current, [field]: validateContact(next)[field] }));
    };

  const focusField = (field: FieldName) => {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      setStatus('idle');
      setAlert('');
      focusField(firstInvalid);
      return;
    }

    setStatus('submitting');
    setAlert('');
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const result = await sendContactMessage(
        {
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          topic: values.topic,
          message: values.message.trim(),
          website: honeypotRef.current?.value ?? '',
        },
        { signal: controller.signal },
      );
      setSentTo({
        name: values.name.trim().split(/\s+/)[0] ?? '',
        email: values.email.trim(),
        confirmationSent: result.confirmationSent,
      });
      setValues(emptyValues);
      setErrors({});
      setStatus('success');
    } catch (error) {
      if (controller.signal.aborted) return;
      const apiError =
        error instanceof ContactApiError ? error : new ContactApiError('Something went wrong. Please try again.');
      setErrors(apiError.fields);
      setAlert(apiError.message);
      setStatus('error');
      const firstInvalid = fieldOrder.find((field) => apiError.fields[field]);
      if (firstInvalid) focusField(firstInvalid);
    }
  };

  if (status === 'success') {
    return (
      <div className={cx(styles.card, styles.success)}>
        <span className={styles.successIcon} aria-hidden="true">
          <Icon name="check" size={22} />
        </span>
        <h3 ref={successRef} className={styles.successTitle} tabIndex={-1}>
          Message sent{sentTo.name ? ` - thank you, ${sentTo.name}` : ''}.
        </h3>
        <p className={styles.successText}>
          It’s landed in my inbox and I’ll reply personally to <strong>{sentTo.email}</strong>.
        </p>
        {sentTo.confirmationSent ? (
          <p className={styles.receipt}>
            <Icon name="mail" size={16} />
            <span>
              A confirmation email is on its way to your inbox. If you don’t see it in a few minutes, check your spam
              folder.
            </span>
          </p>
        ) : null}
        <Button variant="secondary" icon="arrowRight" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      className={styles.card}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={fieldId('heading')}
      aria-busy={submitting}
    >
      <div className={styles.head}>
        <h3 id={fieldId('heading')} className={styles.title}>
          Send a message
        </h3>
        <p className={styles.subtitle}>
          <span className={styles.pulse} aria-hidden="true" />
          {contactFormNote}
        </p>
      </div>

      <div className={styles.grid}>
        <Field id={fieldId('name')} label="Name" error={errors.name}>
          {(props) => (
            <input
              {...props}
              className={styles.input}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={CONTACT_LIMITS.name.max}
              placeholder="Your full name"
              value={values.name}
              onChange={update('name')}
            />
          )}
        </Field>

        <Field id={fieldId('email')} label="Email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              className={styles.input}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={CONTACT_LIMITS.email.max}
              placeholder="you@mail.com"
              value={values.email}
              onChange={update('email')}
            />
          )}
        </Field>

        <Field
          id={fieldId('message')}
          label="Message"
          error={errors.message}
          className={styles.full}
          hint={
            <>
              <span>Share a little context - the role, project or question.</span>
              <span className={styles.count} aria-hidden="true">
                {values.message.length} / {CONTACT_LIMITS.message.max}
              </span>
            </>
          }
        >
          {(props) => (
            <textarea
              {...props}
              className={cx(styles.input, styles.textarea)}
              name="message"
              required
              rows={6}
              maxLength={CONTACT_LIMITS.message.max}
              placeholder="Hi Jeya Balaji, I’d like to talk about…"
              value={values.message}
              onChange={update('message')}
            />
          )}
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={fieldId('website')}>Website</label>
        <input ref={honeypotRef} id={fieldId('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {alert ? (
        <div className={styles.alert} role="alert">
          <p>{alert}</p>
          <p>
            You can also email me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </div>
      ) : null}

      <div className={styles.footer}>
        <p className={styles.privacy}>
          <Icon name="lock" size={15} />
          {contactPrivacyNote}
        </p>
        <Button
          type="submit"
          icon={submitting ? undefined : 'arrowRight'}
          aria-disabled={submitting}
          cursorLabel="Send"
        >
          {submitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </div>
    </form>
  );
}
