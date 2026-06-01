import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchList } from './044-use-transition.tsx';

describe('044-use-transition', () => {
  it('filters list', async () => {
      const user = userEvent.setup();
      render(<SearchList items={['aa', 'bb', 'ab']} />);
      await user.type(screen.getByLabelText('Search'), 'a');
      expect(screen.getByText('aa')).toBeInTheDocument();
      expect(screen.getByText('ab')).toBeInTheDocument();
    });
});
