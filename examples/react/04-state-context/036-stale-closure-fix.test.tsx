import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StaleSafeCounter } from './036-stale-closure-fix.tsx';

describe('036-stale-closure-fix', () => {
  it('increments with functional update', async () => {
      vi.useFakeTimers();
      render(<StaleSafeCounter />);
      await vi.advanceTimersByTimeAsync(200);
      expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThanOrEqual(3);
      vi.useRealTimers();
    });
});
