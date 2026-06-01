import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from './091-rtl-query-priority.tsx';

describe('091-rtl-query-priority', () => {
  it('finds by role and label', () => {
      render(<LoginForm />);
      expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });
});
