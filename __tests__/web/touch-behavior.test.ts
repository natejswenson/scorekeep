import * as fs from 'fs/promises';
import * as path from 'path';

describe('Touch Behavior on Web', () => {
  let indexHtml: string;

  beforeAll(async () => {
    const indexPath = path.join(__dirname, '../../dist/index.html');
    try {
      indexHtml = await fs.readFile(indexPath, 'utf-8');
    } catch (error) {
      indexHtml = '';
    }
  });

  test('should have web-mobile-optimizations CSS', () => {
    expect(indexHtml).toContain('id="web-mobile-optimizations"');
  });

  test('should disable touch-action in CSS', () => {
    expect(indexHtml).toContain('touch-action: none');
  });

  test('should disable overscroll-behavior to prevent pull-to-refresh', () => {
    expect(indexHtml).toContain('overscroll-behavior: none');
  });

  test('should disable webkit touch callout', () => {
    expect(indexHtml).toContain('-webkit-touch-callout: none');
  });

  test('should disable user selection', () => {
    expect(indexHtml).toContain('user-select: none');
  });

  test('should fix body position to prevent iOS bounce', () => {
    expect(indexHtml).toContain('position: fixed');
  });
});
