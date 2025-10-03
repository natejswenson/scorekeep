#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting web mobile optimizations...');

const indexPath = path.join(__dirname, '../dist/index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Check if optimizations already exist
  if (html.includes('id="web-mobile-optimizations"')) {
    console.log('✅ Web mobile optimizations already present');
    process.exit(0);
  }

  // Define the optimization CSS
  const webMobileOptimizationsCSS = `
    <style id="web-mobile-optimizations">
      /* Disable text selection and touch callout */
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      /* Prevent zoom, scroll, and pull-to-refresh */
      html, body {
        touch-action: none;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
        position: fixed;
        width: 100%;
      }
      /* Ensure root container prevents gestures */
      #root {
        touch-action: none;
        overscroll-behavior: none;
      }
    </style>`;

  const safeAreaSupportCSS = `
    <style id="safe-area-support">
      /* Support for notched devices (iPhone X+) */
      @supports (padding: env(safe-area-inset-top)) {
        body {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
      }
    </style>`;

  // Update viewport meta tag
  html = html.replace(
    /<meta name="viewport" content="[^"]*"/,
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"'
  );

  // Add Apple mobile web app meta tags if missing
  if (!html.includes('apple-mobile-web-app-capable')) {
    const appleMeta = `
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="mobile-web-app-capable" content="yes" />`;

    html = html.replace('</head>', `${appleMeta}\n  </head>`);
  }

  // Add manifest link if missing
  if (!html.includes('rel="manifest"')) {
    html = html.replace('</head>', `    <link rel="manifest" href="./manifest.json" />\n  </head>`);
  }

  // Inject optimization CSS before </head>
  html = html.replace('</head>', `${webMobileOptimizationsCSS}${safeAreaSupportCSS}\n  </head>`);

  // Write back the modified HTML
  fs.writeFileSync(indexPath, html, 'utf-8');

  console.log('✅ Web mobile optimizations injected successfully');
  console.log('   - Viewport meta tag updated');
  console.log('   - Apple mobile web app meta tags added');
  console.log('   - Touch-action and overscroll CSS added');
  console.log('   - Safe area insets support added');
} catch (error) {
  console.error('❌ Failed to inject web optimizations:', error.message);
  process.exit(1);
}
