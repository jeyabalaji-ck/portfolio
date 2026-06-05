/**
 * Validation rules for a contact enquiry. The frontend mirrors these limits in
 * src/utils/contactValidation.ts - keep the two in sync.
 */
export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  topic: { max: 80 },
  message: { min: 20, max: 5000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Matching control characters is the point of these two patterns.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]+/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_EXCEPT_NEWLINE = /[\u0000-\u0008\u000b-\u001f\u007f]/g;

/** Collapses whitespace and strips control characters (including CR/LF, which could inject headers). */
function cleanLine(value) {
  return typeof value === 'string' ? value.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim() : '';
}

/** Keeps line breaks in the message body but drops other control characters. */
function cleanText(value) {
  return typeof value === 'string'
    ? value
        .replace(/\r\n?/g, '\n')
        .replace(CONTROL_CHARS_EXCEPT_NEWLINE, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    : '';
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @returns {{ ok: true, data: { name: string, email: string, company: string, topic: string, message: string }, isSpam: boolean }
 *   | { ok: false, errors: Record<string, string> }}
 */
export function validateContact(body) {
  const input = body && typeof body === 'object' ? body : {};
  const data = {
    name: cleanLine(input.name),
    email: cleanLine(input.email).toLowerCase(),
    company: cleanLine(input.company),
    topic: cleanLine(input.topic),
    message: cleanText(input.message),
  };
  const errors = {};

  if (data.name.length < LIMITS.name.min) errors.name = 'Please enter your name.';
  else if (data.name.length > LIMITS.name.max) errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;

  if (!data.email) errors.email = 'Please enter your email address.';
  else if (data.email.length > LIMITS.email.max || !EMAIL_PATTERN.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (data.company.length > LIMITS.company.max) {
    errors.company = `Company must be ${LIMITS.company.max} characters or fewer.`;
  }

  if (data.topic.length > LIMITS.topic.max) errors.topic = 'Please choose a shorter topic.';

  if (data.message.length < LIMITS.message.min) {
    errors.message = `Please write at least ${LIMITS.message.min} characters so I can help.`;
  } else if (data.message.length > LIMITS.message.max) {
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Honeypot: a field hidden from people that bots tend to fill in.
  const isSpam = typeof input.website === 'string' && input.website.trim() !== '';

  return { ok: true, data: { ...data, topic: data.topic || 'General enquiry' }, isSpam };
}
