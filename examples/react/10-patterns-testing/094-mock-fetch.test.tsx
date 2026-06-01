import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { FetchUser } from './094-mock-fetch.tsx';

describe('094-mock-fetch', () => {
  it('loads mocked user', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: async () => ({ name: 'Mock' }),
        }),
      );
      render(<FetchUser />);
      expect(await screen.findByText('Mock')).toBeInTheDocument();
      vi.unstubAllGlobals();
    });
});
