import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './061-compound-tabs.tsx';

describe('061-compound-tabs', () => {
  it('switches panels', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultId="a">
          <Tabs.List>
            <Tabs.Tab id="a">A</Tabs.Tab>
            <Tabs.Tab id="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
          <Tabs.Panel id="b">Panel B</Tabs.Panel>
        </Tabs>,
      );
      expect(screen.getByText('Panel A')).toBeInTheDocument();
      await user.click(screen.getByRole('tab', { name: 'B' }));
      expect(screen.getByText('Panel B')).toBeInTheDocument();
    });
});
