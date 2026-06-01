import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout } from './066-slot-pattern.tsx';

describe('066-slot-pattern', () => {
  it('renders slots', () => {
      render(
        <Layout header={<h1>Title</h1>} footer={<p>Foot</p>}>
          <p>Body</p>
        </Layout>,
      );
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Foot')).toBeInTheDocument();
    });
});
