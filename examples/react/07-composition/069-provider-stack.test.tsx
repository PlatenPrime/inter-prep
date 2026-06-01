import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProviders, ProviderLabels } from './069-provider-stack.tsx';

describe('069-provider-stack', () => {
  it('reads stacked providers', () => {
      render(
        <AppProviders>
          <ProviderLabels />
        </AppProviders>,
      );
      expect(screen.getByTestId('labels')).toHaveTextContent('A-B');
    });
});
