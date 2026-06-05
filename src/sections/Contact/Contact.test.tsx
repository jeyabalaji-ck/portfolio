import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { profile } from '../../data/profile';
import { Contact } from './Contact';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
}

describe('Contact', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers a mailto link for the email address', () => {
    render(<Contact />);

    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
  });

  it('copies the address and announces the result, then resets', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<Contact />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy address/i }));
    });

    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(screen.getByRole('status')).toHaveTextContent(/copied/i);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: /copy address/i })).toBeInTheDocument();
  });

  it('explains when copying is not possible', async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<Contact />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy address/i }));
    });

    expect(screen.getByRole('status')).toHaveTextContent(/copy the address manually/i);
  });
});
