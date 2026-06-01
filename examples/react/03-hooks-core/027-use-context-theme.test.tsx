import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemedText, ThemeProvider } from './027-use-context-theme.tsx';

describe('027-use-context-theme', () => {
  it('reads dark theme', () => {
      render(
        <ThemeProvider theme="dark">
          <ThemedText />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
});
