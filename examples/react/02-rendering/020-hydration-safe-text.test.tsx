import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { ClientOnlyTime } from './020-hydration-safe-text.tsx';

describe('020-hydration-safe-text', () => {
  it('becomes ready after mount', async () => {
      render(<ClientOnlyTime />);
      await waitFor(() => {
        expect(screen.getByTestId('time')).toHaveTextContent('ready');
      });
    });
});
