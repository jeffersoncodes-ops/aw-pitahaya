import { describe, it, expect } from 'vitest';

// Side-effect import so Vite injects the CSS into jsdom
import './index.css';

describe('Index CSS — Línea Gráfica Pitahaya', () => {
  it('body has no background-image', () => {
    const style = getComputedStyle(document.body);
    expect(style.backgroundImage).toBe('none');
  });

  it(':root background-color is white', () => {
    const style = getComputedStyle(document.documentElement);
    expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('.content-wrapper has opaque white background', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';
    document.body.appendChild(wrapper);

    const style = getComputedStyle(wrapper);
    expect(style.backgroundColor).toBe('rgb(255, 255, 255)');

    document.body.removeChild(wrapper);
  });

  it('#root has correct layout styles', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const style = getComputedStyle(root);
    expect(style.display).toBe('flex');
    expect(style.flexDirection).toBe('column');

    document.body.removeChild(root);
  });

  it('.fade-in-page class exists in the stylesheet', () => {
    const stylesheets = Array.from(document.styleSheets);
    const cssText = stylesheets
      .map((ss) => {
        try {
          return Array.from(ss.cssRules)
            .map((r) => r.cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    expect(cssText).toContain('fadeIn');
    expect(cssText).toContain('.fade-in-page');
    expect(cssText).toContain('opacity: 0');
    expect(cssText).toContain('translateY(4px)');
  });
});
