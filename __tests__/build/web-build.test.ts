import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Web Build Process', () => {
  test('inject-web-optimizations script should exist and be executable', async () => {
    const scriptPath = path.join(__dirname, '../../scripts/inject-web-optimizations.js');
    const stats = await fs.stat(scriptPath);

    expect(stats.isFile()).toBe(true);
    // Check if file has execute permissions (on Unix-like systems)
    // On Windows, this test will still pass as long as the file exists
    expect(stats.mode & 0o111).toBeTruthy();
  });

  test('copy-web-assets script should exist and be executable', async () => {
    const scriptPath = path.join(__dirname, '../../scripts/copy-web-assets.js');
    const stats = await fs.stat(scriptPath);

    expect(stats.isFile()).toBe(true);
    expect(stats.mode & 0o111).toBeTruthy();
  });

  test('inject-web-optimizations script should be idempotent', async () => {
    // Check if dist folder exists
    const distPath = path.join(__dirname, '../../dist');
    const distExists = await fs.access(distPath).then(() => true).catch(() => false);

    if (!distExists) {
      console.log('⚠️  Skipping test: dist/ directory does not exist (run build:web first)');
      return;
    }

    // Run the script twice and ensure it doesn't break
    const scriptPath = path.join(__dirname, '../../scripts/inject-web-optimizations.js');

    // First run
    const result1 = execSync(`node ${scriptPath}`, { encoding: 'utf-8' });
    expect(result1).toContain('Web mobile optimizations');

    // Second run should also succeed
    const result2 = execSync(`node ${scriptPath}`, { encoding: 'utf-8' });
    expect(result2).toContain('Web mobile optimizations');
  });

  test('copy-web-assets script should create manifest.json', async () => {
    // Check if dist folder exists
    const distPath = path.join(__dirname, '../../dist');
    const distExists = await fs.access(distPath).then(() => true).catch(() => false);

    if (!distExists) {
      console.log('⚠️  Skipping test: dist/ directory does not exist (run build:web first)');
      return;
    }

    const scriptPath = path.join(__dirname, '../../scripts/copy-web-assets.js');

    // Run the script
    execSync(`node ${scriptPath}`, { encoding: 'utf-8' });

    // Check if manifest exists
    const manifestPath = path.join(__dirname, '../../dist/manifest.json');
    const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);

    expect(manifestExists).toBe(true);
  });

  test('build:web command should be properly configured in package.json', async () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.scripts['build:web']).toBeDefined();
    expect(packageJson.scripts['build:web']).toContain('copy-web-assets');
    expect(packageJson.scripts['build:web']).toContain('inject-web-optimizations');
  });
});
