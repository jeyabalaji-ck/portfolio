import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navItems } from '../../data/profile';
import { Header } from './Header';

describe('Header', () => {
  it('links to every primary section', () => {
    render(<Header />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of navItems) {
      const link = Array.from(nav.querySelectorAll('a')).find((a) => a.textContent === item.label);
      expect(link).toHaveAttribute('href', `#${item.id}`);
    }
  });

  it('opens the mobile menu and closes it with Escape, restoring focus', () => {
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeVisible();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('toggles the colour theme', () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });
});
