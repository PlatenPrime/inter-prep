import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MergedInput } from './065-merge-refs.tsx';

describe('065-merge-refs', () => {
  it('assigns ref', () => {
      render(<MergedInput label="X" />);
      expect(screen.getByLabelText('X')).toBeInTheDocument();
    });
});
