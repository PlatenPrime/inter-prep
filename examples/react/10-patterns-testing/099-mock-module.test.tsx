import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Greeting } from './099-mock-module.tsx';

describe('099-mock-module', () => {
  it('greets user', () => {
      render(<Greeting name="Ada" />);
      expect(screen.getByText('Hello, Ada')).toBeInTheDocument();
    });
});
