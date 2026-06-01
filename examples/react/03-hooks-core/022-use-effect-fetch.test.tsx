import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from './022-use-effect-fetch.tsx';

describe('022-use-effect-fetch', () => {
  it('ticks over time', async () => {
      vi.useFakeTimers();
      render(<Timer ms={100} />);
      await vi.advanceTimersByTimeAsync(250);
      expect(Number(screen.getByTestId('ticks').textContent)).toBeGreaterThanOrEqual(2);
      vi.useRealTimers();
    });
});
