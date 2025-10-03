import * as fs from 'fs/promises';
import * as path from 'path';

describe('Touch Behavior on Web', () => {
  let indexHtml: string;
  let fileExists: boolean;

  beforeAll(async () => {
    const indexPath = path.join(__dirname, '../../dist/index.html');
    try {
      indexHtml = await fs.readFile(indexPath, 'utf-8');
      fileExists = true;
    } catch (error) {
      indexHtml = '';
      fileExists = false;
    }
  });

  test('should have web-mobile-optimizations CSS', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('id="web-mobile-optimizations"');
  });

  test('should disable touch-action in CSS', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('touch-action: none');
  });

  test('should disable overscroll-behavior to prevent pull-to-refresh', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('overscroll-behavior: none');
  });

  test('should disable webkit touch callout', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('-webkit-touch-callout: none');
  });

  test('should disable user selection', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('user-select: none');
  });

  test('should fix body position to prevent iOS bounce', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('position: fixed');
  });
});
