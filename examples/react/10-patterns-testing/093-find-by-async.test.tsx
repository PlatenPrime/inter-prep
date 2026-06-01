import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { AsyncMessage } from './093-find-by-async.tsx';

describe('093-find-by-async', () => {
  it('finds ready message', async () => {
      render(<AsyncMessage />);
      expect(await screen.findByText('Ready')).toBeInTheDocument();
    });
});
