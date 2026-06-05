import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { profile } from '../../data/profile';
import { CONTACT_ENDPOINT } from '../../services/contactApi';
import { ContactForm } from './ContactForm';

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  Ada Lovelace ' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
  fireEvent.click(screen.getByRole('radio', { name: 'Freelance project' }));
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'I have a React dashboard that needs a rebuild.' },
  });
}

async function submit() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
  });
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows inline errors, focuses the first invalid field and does not call the API', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    render(<ContactForm />);

    await submit();

    const name = screen.getByLabelText('Name');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Please enter your name.');
    expect(name).toHaveFocus();
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(/enter your email/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the value becomes valid', async () => {
    mockFetch(200, { ok: true });
    render(<ContactForm />);
    await submit();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });

    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false');
  });

  it('posts a trimmed payload to the contact API and confirms success', async () => {
    const fetchMock = mockFetch(200, { ok: true, message: 'Thanks!', confirmationSent: true });
    render(<ContactForm />);
    fillValidForm();

    await submit();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(CONTACT_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: '',
      topic: 'Freelance project',
      message: 'I have a React dashboard that needs a rebuild.',
      website: '',
    });

    const heading = await screen.findByRole('heading', { name: /message sent - thank you, ada/i });
    expect(heading).toHaveFocus();
    expect(screen.getByText(/confirmation email is on its way/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /send another message/i }));
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('does not promise a confirmation email the API did not send', async () => {
    mockFetch(200, { ok: true, message: 'Thanks!', confirmationSent: false });
    render(<ContactForm />);
    fillValidForm();

    await submit();

    await screen.findByRole('heading', { name: /message sent/i });
    expect(screen.queryByText(/confirmation email/i)).not.toBeInTheDocument();
  });

  it('shows field errors returned by the API', async () => {
    mockFetch(400, {
      ok: false,
      error: 'Please check the highlighted fields.',
      fields: { email: 'Please enter a valid email address.' },
    });
    render(<ContactForm />);
    fillValidForm();

    await submit();

    expect(screen.getByRole('alert')).toHaveTextContent('Please check the highlighted fields.');
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Please enter a valid email address.');
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('offers the email address when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    render(<ContactForm />);
    fillValidForm();

    await submit();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/could not reach the server/i);
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`);
    // The visitor's draft is kept so they can retry.
    expect(screen.getByLabelText('Name')).toHaveValue('  Ada Lovelace ');
  });
});
