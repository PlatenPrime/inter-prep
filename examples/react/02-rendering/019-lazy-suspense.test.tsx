import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { LazyPanel } from './019-lazy-suspense.tsx';

describe('019-lazy-suspense', () => {
  it('loads lazy component', async () => {
      render(<LazyPanel />);
      expect(await screen.findByText('Heavy loaded')).toBeInTheDocument();
    });
});
