import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarLink } from './002-props-spread.tsx';

describe('002-props-spread', () => {
  it('renders linked avatar', () => {
      render(<AvatarLink src="/a.png" alt="User" href="/profile" />);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/profile');
      expect(screen.getByRole('img', { name: 'User' })).toBeInTheDocument();
    });
});
