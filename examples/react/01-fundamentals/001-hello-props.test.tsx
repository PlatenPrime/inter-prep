import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hello } from './001-hello-props.tsx';

describe('001-hello-props', () => {
  it('renders greeting', () => {
      render(<Hello name="World" />);
      expect(screen.getByRole('heading', { name: /hello, world/i })).toBeInTheDocument();
    });
});
