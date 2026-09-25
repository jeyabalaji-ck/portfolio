import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { projects } from '../../data/projects';
import { CaseStudyDialog } from './CaseStudyDialog';

const byId = (id: string) => {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Missing project fixture: ${id}`);
  return project;
};

describe('CaseStudyDialog', () => {
  it('shows only documented sections for a project', () => {
    render(<CaseStudyDialog project={byId('employee')} index={1} total={4} onClose={() => undefined} />);

    expect(screen.getByRole('heading', { name: 'Employee Management System' })).toBeInTheDocument();
    for (const label of ['Problem', 'Solution', 'Technologies', 'Key contribution']) {
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument();
    }
    // No result is documented for this project, so none is invented.
    expect(screen.queryByRole('heading', { name: 'Result' })).not.toBeInTheDocument();
  });

  it('shows the recognised result and closes from the close button', () => {
    const onClose = vi.fn();
    render(<CaseStudyDialog project={byId('saffron')} index={3} total={4} onClose={onClose} />);

    expect(screen.getByRole('heading', { name: 'Result' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close case study/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
