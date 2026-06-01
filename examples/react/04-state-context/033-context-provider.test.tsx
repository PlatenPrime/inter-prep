import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserGreeting, UserProvider } from './033-context-provider.tsx';

describe('033-context-provider', () => {
  it('greets user', () => {
      render(
        <UserProvider user={{ name: 'Ann' }}>
          <UserGreeting />
        </UserProvider>,
      );
      expect(screen.getByText('Hi, Ann')).toBeInTheDocument();
    });
});
