import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemedBadge, ThemeWrap } from './095-custom-render.tsx';

describe('095-custom-render', () => {
  it('renders with theme wrap', () => {
      render(
        <ThemeWrap>
          <ThemedBadge />
        </ThemeWrap>,
      );
      expect(screen.getByTestId('badge')).toHaveTextContent('dark');
    });
});
