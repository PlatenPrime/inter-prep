import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './051-controlled-text.tsx';

describe('051-controlled-text', () => {
  it('types text', async () => {
      const user = userEvent.setup();
      render(<TextField />);
      await user.type(screen.getByLabelText('Title'), 'Hi');
      expect(screen.getByLabelText('Title')).toHaveValue('Hi');
    });
});
