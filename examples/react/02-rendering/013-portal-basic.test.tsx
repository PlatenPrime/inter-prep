import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import { ModalPortal } from './013-portal-basic.tsx';

describe('013-portal-basic', () => {
  it('renders children in portal root', () => {
      render(
        <ModalPortal open>
          <p>Modal body</p>
        </ModalPortal>,
      );
      const portal = screen.getByTestId('portal-root');
      expect(within(portal).getByText('Modal body')).toBeInTheDocument();
    });
});
