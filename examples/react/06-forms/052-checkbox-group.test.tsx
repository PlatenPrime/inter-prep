import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup } from './052-checkbox-group.tsx';

describe('052-checkbox-group', () => {
  it('selects two', async () => {
      const user = userEvent.setup();
      render(<CheckboxGroup />);
      await user.click(screen.getByLabelText('a'));
      await user.click(screen.getByLabelText('b'));
      expect(screen.getByTestId('count')).toHaveTextContent('2');
    });
});
