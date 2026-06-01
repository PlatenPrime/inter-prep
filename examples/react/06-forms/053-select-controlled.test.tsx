import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountrySelect } from './053-select-controlled.tsx';

describe('053-select-controlled', () => {
  it('changes country', async () => {
      const user = userEvent.setup();
      render(<CountrySelect />);
      await user.selectOptions(screen.getByRole('combobox'), 'uk');
      expect(screen.getByTestId('out')).toHaveTextContent('uk');
    });
});
