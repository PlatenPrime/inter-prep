import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { MountLogger } from './010-strict-mode-dev.tsx';

describe('010-strict-mode-dev', () => {
  it('increments mount count once without StrictMode', async () => {
      render(<MountLogger />);
      await waitFor(() => {
        expect(screen.getByTestId('mounts')).toHaveTextContent('1');
      });
    });
});
