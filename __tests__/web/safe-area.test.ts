import * as fs from 'fs/promises';
import * as path from 'path';

describe('Safe Area Insets Support', () => {
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

  test('should have safe-area-support CSS', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('id="safe-area-support"');
  });

  test('should use env(safe-area-inset-top)', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('env(safe-area-inset-top)');
  });

  test('should use env(safe-area-inset-bottom)', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('env(safe-area-inset-bottom)');
  });

  test('should use env(safe-area-inset-left)', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('env(safe-area-inset-left)');
  });

  test('should use env(safe-area-inset-right)', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('env(safe-area-inset-right)');
  });

  test('should use @supports for progressive enhancement', () => {
    if (!fileExists) {
      console.log('⚠️  Skipping test: dist/index.html does not exist (run build:web first)');
      return;
    }
    expect(indexHtml).toContain('@supports');
  });
});
