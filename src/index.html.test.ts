import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Index HTML — Línea Gráfica Pitahaya', () => {
  const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');

  it('has updated title "Pitahaya — Biodiversidad Ecuador"', () => {
    const match = html.match(/<title>(.*?)<\/title>/);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('Pitahaya — Biodiversidad Ecuador');
  });

  it('still has the root div', () => {
    expect(html).toContain('<div id="root"></div>');
  });

  it('still has the module script', () => {
    expect(html).toContain('/src/main.tsx');
  });
});
