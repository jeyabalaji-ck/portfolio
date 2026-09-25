import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { stackCategories } from '../../data/stack';
import { Stack } from './Stack';

describe('Stack', () => {
  it('lists every technology as a button', () => {
    render(<Stack />);
    for (const category of stackCategories) {
      for (const item of category.items) {
        expect(screen.getByRole('button', { name: item.name })).toBeInTheDocument();
      }
    }
  });

  it('explains a technology when it is selected, and marks it pressed', () => {
    render(<Stack />);
    const rtk = screen.getByRole('button', { name: 'RTK Query' });
    fireEvent.click(rtk);

    expect(rtk).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/caching and invalidation/i)).toBeInTheDocument();
  });
});
