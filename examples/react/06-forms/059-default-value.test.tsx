import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DefaultInput } from './059-default-value.tsx';

describe('059-default-value', () => {
  it('has default', () => {
      render(<DefaultInput />);
      expect(screen.getByLabelText('City')).toHaveValue('Berlin');
    });
});
