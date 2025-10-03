import * as fs from 'fs/promises';
import * as path from 'path';

describe('Web Viewport Configuration', () => {
  let indexHtml: string;

  beforeAll(async () => {
    const indexPath = path.join(__dirname, '../../dist/index.html');
    try {
      indexHtml = await fs.readFile(indexPath, 'utf-8');
    } catch (error) {
      // File might not exist yet, will be created during build
      indexHtml = '';
    }
  });

  test('index.html should have correct viewport meta tag', () => {
    const viewportMeta = indexHtml.match(/<meta name="viewport" content="([^"]+)"/);

    expect(viewportMeta).toBeTruthy();
    expect(viewportMeta![1]).toContain('width=device-width');
    expect(viewportMeta![1]).toContain('initial-scale=1');
    expect(viewportMeta![1]).toContain('maximum-scale=1');
    expect(viewportMeta![1]).toContain('user-scalable=no');
    expect(viewportMeta![1]).toContain('viewport-fit=cover');
  });

  test('should not allow viewport shrink-to-fit', () => {
    const viewportMeta = indexHtml.match(/<meta name="viewport" content="([^"]+)"/);

    expect(viewportMeta).toBeTruthy();
    expect(viewportMeta![1]).not.toContain('shrink-to-fit=yes');
  });

  test('should include Apple mobile web app meta tags', () => {
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-capable" content="yes"');
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"');
    expect(indexHtml).toContain('<meta name="mobile-web-app-capable" content="yes"');
  });
});
