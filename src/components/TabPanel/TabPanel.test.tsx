import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import TabPanel from './TabPanel';

describe('TabPanel', () => {
  it('renders children when value matches index', () => {
    render(
      <TabPanel value={0} index={0}>
        <div>content</div>
      </TabPanel>,
    );

    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toHaveTextContent('content');
    expect(tabpanel).not.toHaveAttribute('hidden');
  });

  it('hides children when value differs from index', () => {
    render(
      <TabPanel value={1} index={0}>
        <div>hidden</div>
      </TabPanel>,
    );

    const tabpanel = screen.getByRole('tabpanel', { hidden: true });
    expect(tabpanel).toHaveAttribute('hidden');
  });
});
