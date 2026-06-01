import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorBox, SplitProviders, CountLabel } from './034-split-context.tsx';

describe('034-split-context', () => {
  it('reads split contexts', () => {
      render(
        <SplitProviders>
          <ColorBox />
          <CountLabel />
        </SplitProviders>,
      );
      expect(screen.getByTestId('count')).toHaveTextContent('5');
    });
});
