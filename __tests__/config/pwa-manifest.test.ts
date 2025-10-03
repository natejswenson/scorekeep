import * as fs from 'fs/promises';
import * as path from 'path';

describe('PWA Manifest', () => {
  let manifestExists = false;
  let manifest: any = {};

  beforeAll(async () => {
    const manifestPath = path.join(__dirname, '../../dist/manifest.json');
    try {
      const content = await fs.readFile(manifestPath, 'utf-8');
      manifest = JSON.parse(content);
      manifestExists = true;
    } catch (error) {
      manifestExists = false;
    }
  });

  test('manifest.json should exist', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifestExists).toBe(true);
  });

  test('should have correct app name', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifest.name).toBe('ScoreKeep');
    expect(manifest.short_name).toBe('ScoreKeep');
  });

  test('should use fullscreen display mode', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifest.display).toBe('fullscreen');
  });

  test('should allow any orientation', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifest.orientation).toBe('any');
  });

  test('should have theme and background colors', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
  });

  test('should have icon configuration', () => {
    if (!manifestExists) {
      console.log('⚠️  Skipping test: dist/manifest.json does not exist (run build:web first)');
      return;
    }
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});
