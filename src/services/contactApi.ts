import type { ContactErrors, ContactFields } from '../utils/contactValidation';

const apiBase = (import.meta.env.VITE_CONTACT_API_URL ?? '').trim().replace(/\/+$/, '');

export const CONTACT_ENDPOINT = `${apiBase}/api/contact`;

export interface ContactPayload extends ContactFields {
  /** Honeypot - always empty for real visitors. */
  website: string;
}

interface ContactResponse {
  ok: boolean;
  message?: string;
  confirmationSent?: boolean;
  error?: string;
  fields?: ContactErrors;
}

export interface ContactResult {
  message: string;
  /** Whether the visitor was emailed a "message received" confirmation. */
  confirmationSent: boolean;
}

export class ContactApiError extends Error {
  readonly fields: ContactErrors;

  constructor(message: string, fields: ContactErrors = {}) {
    super(message);
    this.name = 'ContactApiError';
    this.fields = fields;
  }
}

/**
 * Posts an enquiry to the contact API. Resolves with the result to show the
 * visitor, or rejects with a `ContactApiError` whose message is safe to show visitors.
 * Aborting through `signal` rejects with the original `AbortError`.
 */
export async function sendContactMessage(
  payload: ContactPayload,
  { signal, timeoutMs = 25_000 }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<ContactResult> {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener('abort', forwardAbort, { once: true });
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response: Response;
  try {
    response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ContactApiError(
      timedOut
        ? 'The server took too long to respond. Please try again.'
        : 'Could not reach the server. Check your connection and try again.',
    );
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  const body = (await response.json().catch(() => null)) as ContactResponse | null;

  if (!response.ok || !body?.ok) {
    throw new ContactApiError(body?.error ?? 'Something went wrong. Please try again.', body?.fields);
  }

  return {
    message: body.message ?? 'Thanks! Your message has been sent.',
    confirmationSent: body.confirmationSent === true,
  };
}
