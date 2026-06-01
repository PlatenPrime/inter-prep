import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilePicker } from './058-file-input.tsx';

describe('058-file-input', () => {
  it('shows file name', async () => {
      const user = userEvent.setup();
      render(<FilePicker />);
      const file = new File(['x'], 'test.txt', { type: 'text/plain' });
      await user.upload(screen.getByLabelText('File'), file);
      expect(screen.getByTestId('name')).toHaveTextContent('test.txt');
    });
});
