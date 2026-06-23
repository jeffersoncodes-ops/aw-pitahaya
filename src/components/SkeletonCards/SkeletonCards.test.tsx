import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import SkeletonCards from './SkeletonCards';

describe('SkeletonCards', () => {
  it('renders default 3 skeleton cards', () => {
    render(<SkeletonCards />);

    const cards = screen.getAllByTestId('skeleton-card');
    expect(cards).toHaveLength(3);
  });

  it('renders custom count when provided', () => {
    render(<SkeletonCards count={6} />);

    const cards = screen.getAllByTestId('skeleton-card');
    expect(cards).toHaveLength(6);
  });

  it('renders single skeleton when count is 1', () => {
    render(<SkeletonCards count={1} />);

    const cards = screen.getAllByTestId('skeleton-card');
    expect(cards).toHaveLength(1);
  });
});
