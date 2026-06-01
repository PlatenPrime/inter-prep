import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoContextConsumer, MemoContextProvider } from './047-context-value-memo.tsx';

describe('047-context-value-memo', () => {
  it('increments context', async () => {
      const user = userEvent.setup();
      render(
        <MemoContextProvider>
          <MemoContextConsumer />
        </MemoContextProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Inc' }));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
});
