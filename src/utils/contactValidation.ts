/**
 * Client-side checks for the contact form. They mirror server/src/validation.js
 * so visitors see problems instantly; the API still validates everything.
 */
export interface ContactFields {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 5000 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < CONTACT_LIMITS.name.min) errors.name = 'Please enter your name.';
  else if (name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Name must be ${CONTACT_LIMITS.name.max} characters or fewer.`;
  }

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.company.trim().length > CONTACT_LIMITS.company.max) {
    errors.company = `Company must be ${CONTACT_LIMITS.company.max} characters or fewer.`;
  }

  if (message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Please write at least ${CONTACT_LIMITS.message.min} characters so I can help.`;
  } else if (message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Message must be ${CONTACT_LIMITS.message.max} characters or fewer.`;
  }

  return errors;
}
