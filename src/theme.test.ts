import { describe, it, expect } from 'vitest';
import theme from './theme';

describe('Theme — Línea Gráfica Pitahaya', () => {
  it('has green primary palette', () => {
    expect(theme.palette.primary.main).toBe('#2E7D32');
    expect(theme.palette.primary.light).toBe('#4CAF50');
    expect(theme.palette.primary.dark).toBe('#1B5E20');
  });

  it('has red secondary palette', () => {
    expect(theme.palette.secondary.main).toBe('#D32F2F');
    expect(theme.palette.secondary.light).toBe('#EF5350');
    expect(theme.palette.secondary.dark).toBe('#B71C1C');
  });

  it('has white background default', () => {
    expect(theme.palette.background.default).toBe('#FFFFFF');
  });

  it('preserves typography settings', () => {
    expect(theme.typography.h3?.fontWeight).toBe(700);
    expect(theme.typography.h4?.fontWeight).toBe(700);
    expect(theme.typography.h5?.fontWeight).toBe(600);
    expect(theme.typography.h6?.fontWeight).toBe(600);
  });

  it('preserves component overrides', () => {
    // MuiAppBar defaultProps
    const appBarDefaultProps = (theme.components?.MuiAppBar as Record<string, unknown>)
      ?.defaultProps as Record<string, unknown> | undefined;
    expect(appBarDefaultProps?.color).toBe('primary');

    // MuiButton styleOverrides
    const buttonOverrides = (
      (theme.components?.MuiButton as Record<string, unknown>)?.styleOverrides as Record<
        string,
        unknown
      >
    )?.root as Record<string, unknown> | undefined;
    expect(buttonOverrides?.textTransform).toBe('none');
    expect(buttonOverrides?.borderRadius).toBe(8);

    // MuiTableCell styleOverrides
    const cellOverrides = (
      (theme.components?.MuiTableCell as Record<string, unknown>)?.styleOverrides as Record<
        string,
        unknown
      >
    )?.root as Record<string, unknown> | undefined;
    expect(cellOverrides?.fontWeight).toBe(400);
  });
});
