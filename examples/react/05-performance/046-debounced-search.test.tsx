import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { DebouncedSearch } from './046-debounced-search.tsx';

describe('046-debounced-search', () => {
  it('debounces input', async () => {
      render(<DebouncedSearch delay={80} />);
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('Query'), 'hi');
      await waitFor(
        () => expect(screen.getByTestId('debounced')).toHaveTextContent('hi'),
        { timeout: 2000 },
      );
    });
});
