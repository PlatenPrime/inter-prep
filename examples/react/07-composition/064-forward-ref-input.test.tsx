import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextInput } from './064-forward-ref-input.tsx';

describe('064-forward-ref-input', () => {
  it('focuses via ref', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<TextInput ref={ref} label="Name" />);
      ref.current?.focus();
      expect(screen.getByLabelText('Name')).toHaveFocus();
    });
});
