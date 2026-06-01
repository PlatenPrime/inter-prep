import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimpleDialog } from './070-dialog-focus.tsx';

describe('070-dialog-focus', () => {
  it('focuses ok button', () => {
      render(<SimpleDialog open onClose={() => {}} />);
      expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus();
    });
});
