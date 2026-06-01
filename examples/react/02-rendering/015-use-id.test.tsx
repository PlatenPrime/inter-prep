import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LabeledInput } from './015-use-id.tsx';

describe('015-use-id', () => {
  it('associates label with input', () => {
      render(<LabeledInput label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id');
    });
});
