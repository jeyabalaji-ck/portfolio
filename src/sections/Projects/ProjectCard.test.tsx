import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

const byId = (id: string) => {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Missing project fixture: ${id}`);
  return project;
};

describe('ProjectCard', () => {
  it('renders a safe external GitHub link when a repository exists', () => {
    render(<ProjectCard project={byId('inventory')} />);

    const link = screen.getByRole('link', { name: /view on github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/jeyabalaji-ck/inventory-management-system');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the repository link when none is published', () => {
    render(<ProjectCard project={byId('ecommerce')} />);

    expect(screen.getByRole('heading', { name: 'E-Commerce Management Platform' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows recognition when present', () => {
    render(<ProjectCard project={byId('saffron')} />);

    expect(screen.getByText(/smart india hackathon 2024/i, { selector: 'p' })).toBeInTheDocument();
  });
});
