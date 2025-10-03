#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 Copying web assets...');

const distPath = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  console.log('⚠️  dist directory does not exist yet');
  process.exit(0);
}

// Create manifest.json if it doesn't exist
const manifestPath = path.join(distPath, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  const manifest = {
    name: 'ScoreKeep',
    short_name: 'ScoreKeep',
    description: 'Clean, ad-free volleyball scorekeeping app',
    start_url: '.',
    display: 'fullscreen',
    orientation: 'any',
    theme_color: '#FF0000',
    background_color: '#FFFFFF',
    icons: [
      {
        src: './favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
      {
        src: './assets/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './assets/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('✅ manifest.json created');
} else {
  console.log('✅ manifest.json already exists');
}

console.log('✅ Web assets ready');
