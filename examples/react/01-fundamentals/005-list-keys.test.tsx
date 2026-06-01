import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagList } from './005-list-keys.tsx';

describe('005-list-keys', () => {
  it('renders all tags', () => {
      render(
        <TagList
          tags={[
            { id: '1', label: 'React' },
            { id: '2', label: 'TS' },
          ]}
        />,
      );
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TS')).toBeInTheDocument();
    });
});
