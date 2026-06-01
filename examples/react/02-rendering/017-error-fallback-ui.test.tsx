import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './017-error-fallback-ui.tsx';

describe('017-error-fallback-ui', () => {
  it('shows alert on error', () => {
      render(<ErrorMessage error={new Error('Failed')} />);
      expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    });
});
