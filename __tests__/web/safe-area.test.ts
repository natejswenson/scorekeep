import * as fs from 'fs/promises';
import * as path from 'path';

describe('Safe Area Insets Support', () => {
  let indexHtml: string;

  beforeAll(async () => {
    const indexPath = path.join(__dirname, '../../dist/index.html');
    try {
      indexHtml = await fs.readFile(indexPath, 'utf-8');
    } catch (error) {
      indexHtml = '';
    }
  });

  test('should have safe-area-support CSS', () => {
    expect(indexHtml).toContain('id="safe-area-support"');
  });

  test('should use env(safe-area-inset-top)', () => {
    expect(indexHtml).toContain('env(safe-area-inset-top)');
  });

  test('should use env(safe-area-inset-bottom)', () => {
    expect(indexHtml).toContain('env(safe-area-inset-bottom)');
  });

  test('should use env(safe-area-inset-left)', () => {
    expect(indexHtml).toContain('env(safe-area-inset-left)');
  });

  test('should use env(safe-area-inset-right)', () => {
    expect(indexHtml).toContain('env(safe-area-inset-right)');
  });

  test('should use @supports for progressive enhancement', () => {
    expect(indexHtml).toContain('@supports');
  });
});
