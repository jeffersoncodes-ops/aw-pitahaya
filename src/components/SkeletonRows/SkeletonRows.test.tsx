import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import SkeletonRows from './SkeletonRows';

describe('SkeletonRows', () => {
  it('renders default 5 rows × 4 columns skeleton cells', () => {
    render(<SkeletonRows />);

    const cells = screen.getAllByTestId('skeleton-cell');
    expect(cells).toHaveLength(5 * 4);
  });

  it('renders custom row count', () => {
    render(<SkeletonRows rows={3} />);

    const cells = screen.getAllByTestId('skeleton-cell');
    expect(cells).toHaveLength(3 * 4);
  });

  it('renders custom column count', () => {
    render(<SkeletonRows columns={6} />);

    const cells = screen.getAllByTestId('skeleton-cell');
    expect(cells).toHaveLength(5 * 6);
  });

  it('renders custom rows and columns', () => {
    render(<SkeletonRows rows={2} columns={3} />);

    const cells = screen.getAllByTestId('skeleton-cell');
    expect(cells).toHaveLength(2 * 3);
  });
});
