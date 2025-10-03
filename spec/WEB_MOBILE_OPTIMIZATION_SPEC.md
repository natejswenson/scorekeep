# Web Mobile Optimization Specification

## Overview
Optimize ScoreKeep for mobile web browsers by improving viewport handling, touch interactions, preventing unwanted behaviors (zoom, scroll, pull-to-refresh), and ensuring responsive layout rendering.

## Problem Statement
The app is built with React Native for Expo and renders on web via `react-native-web`. While it works on native platforms, the web version on mobile devices may suffer from:
- Improper viewport scaling
- Accidental zoom on double-tap/pinch
- Unwanted scroll behaviors
- Pull-to-refresh interference
- Sub-optimal touch target sizing for web
- Layout shifts or rendering issues on mobile browsers
- Missing PWA capabilities for installation

## Requirements

### Functional Requirements

1. **FR1**: Viewport meta tag must prevent user scaling and set proper initial scale
2. **FR2**: Double-tap and pinch-zoom must be disabled for the entire app
3. **FR3**: Pull-to-refresh must be disabled to prevent accidental reloads during gameplay
4. **FR4**: Touch interactions must work smoothly with proper touch-action CSS
5. **FR5**: All touch targets must meet WCAG minimum size (44x44px) on web
6. **FR6**: Layout must adapt correctly to mobile viewport dimensions (320px-428px widths)
7. **FR7**: Orientation changes must trigger proper layout recalculation
8. **FR8**: App must prevent body scrolling/overscroll on all mobile browsers
9. **FR9**: App must provide PWA manifest for "Add to Home Screen" capability
10. **FR10**: Safe area insets must be respected on notched devices (iPhone X+)

### Non-Functional Requirements

1. **NFR1**: No layout shift or flicker during orientation changes
2. **NFR2**: Touch response latency < 100ms
3. **NFR3**: Works on iOS Safari 14+, Chrome Mobile 90+, Firefox Mobile 90+
4. **NFR4**: 100% Lighthouse accessibility score maintained
5. **NFR5**: CSS optimizations must not break native platform rendering

## TDD Implementation Plan

### Phase 1: Viewport and Meta Tags (Red → Green → Refactor)

#### Test 1.1: Viewport Meta Tag Configuration
**RED** - Write failing test:
```typescript
// __tests__/web/viewport.test.ts
describe('Web Viewport Configuration', () => {
  test('index.html should have correct viewport meta tag', async () => {
    const indexHtml = await fs.readFile('dist/index.html', 'utf-8');
    const viewportMeta = indexHtml.match(/<meta name="viewport" content="([^"]+)"/);

    expect(viewportMeta).toBeTruthy();
    expect(viewportMeta![1]).toContain('width=device-width');
    expect(viewportMeta![1]).toContain('initial-scale=1');
    expect(viewportMeta![1]).toContain('maximum-scale=1');
    expect(viewportMeta![1]).toContain('user-scalable=no');
    expect(viewportMeta![1]).toContain('viewport-fit=cover'); // For safe area insets
  });

  test('should prevent viewport shrink-to-fit', async () => {
    const indexHtml = await fs.readFile('dist/index.html', 'utf-8');
    const viewportMeta = indexHtml.match(/<meta name="viewport" content="([^"]+)"/);

    expect(viewportMeta![1]).not.toContain('shrink-to-fit=yes');
  });
});
```

**GREEN** - Update `dist/index.html` template:
```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
/>
```

**REFACTOR** - Ensure build script preserves viewport meta tag.

#### Test 1.2: Apple Mobile Web App Meta Tags
**RED** - Write failing test:
```typescript
test('should include Apple mobile web app meta tags', async () => {
  const indexHtml = await fs.readFile('dist/index.html', 'utf-8');

  expect(indexHtml).toContain('<meta name="apple-mobile-web-app-capable" content="yes">');
  expect(indexHtml).toContain('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">');
  expect(indexHtml).toContain('<meta name="mobile-web-app-capable" content="yes">');
});
```

**GREEN** - Add meta tags to HTML template.

### Phase 2: CSS Touch and Scroll Prevention

#### Test 2.1: Global Touch-Action CSS
**RED** - Write failing test:
```typescript
// __tests__/web/touch-behavior.test.tsx
import { render } from '@testing-library/react-native';
import App from '../../App';

describe('Touch Behavior on Web', () => {
  test('root container should have touch-action none', () => {
    const { container } = render(<App />);
    const style = window.getComputedStyle(container.firstChild as Element);

    expect(style.touchAction).toBe('none');
  });
});
```

**GREEN** - Add global CSS in `dist/index.html`:
```html
<style id="web-mobile-optimizations">
  * {
    -webkit-touch-callout: none; /* Disable iOS callout */
    -webkit-user-select: none;   /* Disable text selection */
    user-select: none;
  }

  html, body {
    touch-action: none;           /* Disable all touch gestures */
    overscroll-behavior: none;    /* Prevent pull-to-refresh */
    -webkit-overflow-scrolling: touch;
    position: fixed;              /* Prevent iOS Safari bounce */
    width: 100%;
    height: 100%;
  }

  #root {
    touch-action: none;
    overscroll-behavior: none;
  }
</style>
```

**REFACTOR** - Extract to separate CSS file if needed.

#### Test 2.2: Prevent Double-Tap Zoom
**RED** - Write failing test:
```typescript
test('buttons should prevent double-tap zoom', () => {
  const { getByTestId } = render(<GameScreen />);
  const scoreButton = getByTestId('team1-score-area');

  const style = window.getComputedStyle(scoreButton as any);
  expect(style.touchAction).toMatch(/manipulation|none/);
});
```

**GREEN** - Add `touchAction: 'manipulation'` to interactive styles:
```typescript
// src/components/GameScreen.tsx
portraitScoreButton: {
  paddingHorizontal: 4,
  // @ts-ignore - web-only style
  touchAction: 'manipulation',
},
```

### Phase 3: App Configuration Updates

#### Test 3.1: Expo App Config for Web
**RED** - Write failing test:
```typescript
// __tests__/config/app.config.test.ts
import appJson from '../../app.json';

describe('App Configuration for Web', () => {
  test('should allow both portrait and landscape orientations for web', () => {
    // Note: app.json has "portrait" but we need web to support both
    expect(appJson.expo.orientation).toBe('portrait');
    // Web config should override this
    expect(appJson.expo.web?.orientation).toBeUndefined(); // Allows both
  });

  test('should have web manifest configured', () => {
    expect(appJson.expo.web).toBeDefined();
    expect(appJson.expo.web?.favicon).toBe('./assets/favicon.png');
  });
});
```

**GREEN** - Update `app.json`:
```json
{
  "expo": {
    "name": "ScoreKeep",
    "orientation": "portrait",
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro",
      "orientation": "default"
    }
  }
}
```

#### Test 3.2: PWA Manifest
**RED** - Write failing test:
```typescript
test('should have PWA manifest.json', async () => {
  const manifestExists = await fs.access('dist/manifest.json').then(() => true).catch(() => false);
  expect(manifestExists).toBe(true);

  const manifest = JSON.parse(await fs.readFile('dist/manifest.json', 'utf-8'));
  expect(manifest.name).toBe('ScoreKeep');
  expect(manifest.display).toBe('fullscreen');
  expect(manifest.orientation).toBe('any');
});
```

**GREEN** - Create `public/manifest.json`:
```json
{
  "name": "ScoreKeep",
  "short_name": "ScoreKeep",
  "description": "Volleyball scorekeeping app",
  "start_url": ".",
  "display": "fullscreen",
  "orientation": "any",
  "theme_color": "#FF0000",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "./assets/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Phase 4: Safe Area Insets (iOS Notch)

#### Test 4.1: Safe Area CSS Variables
**RED** - Write failing test:
```typescript
test('should use CSS safe-area-inset variables on web', async () => {
  const indexHtml = await fs.readFile('dist/index.html', 'utf-8');

  expect(indexHtml).toContain('env(safe-area-inset-');
});
```

**GREEN** - Add safe area CSS:
```html
<style id="safe-area-support">
  @supports (padding: env(safe-area-inset-top)) {
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }
</style>
```

### Phase 5: Responsive Layout Validation

#### Test 5.1: Mobile Viewport Rendering
**RED** - Write failing test:
```typescript
// __tests__/web/responsive.test.tsx
describe('Mobile Viewport Rendering', () => {
  const mobileViewports = [
    { width: 320, height: 568, device: 'iPhone SE' },
    { width: 375, height: 667, device: 'iPhone 8' },
    { width: 390, height: 844, device: 'iPhone 12' },
    { width: 428, height: 926, device: 'iPhone 14 Pro Max' },
  ];

  test.each(mobileViewports)('should render correctly at $device dimensions', ({ width, height }) => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });

    const { getByTestId } = render(<GameScreen />);
    const scoreButton = getByTestId('team1-score-area');

    // Score should be visible and properly sized
    expect(scoreButton).toBeTruthy();
  });
});
```

**GREEN** - Ensure existing responsive logic works on web.

#### Test 5.2: Orientation Change Handling
**RED** - Write failing test:
```typescript
test('should recalculate layout on orientation change', () => {
  const { getByTestId, rerender } = render(<GameScreen />);

  // Portrait
  Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
  window.dispatchEvent(new Event('resize'));

  rerender(<GameScreen />);
  expect(getByTestId('portraitContainer')).toBeTruthy();

  // Landscape
  Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
  window.dispatchEvent(new Event('resize'));

  rerender(<GameScreen />);
  expect(getByTestId('landscapeContainer')).toBeTruthy();
});
```

**GREEN** - Verify `useOrientation` hook responds to window resize.

### Phase 6: Build Process Integration

#### Test 6.1: Build Script Preserves Meta Tags
**RED** - Write failing test:
```typescript
// __tests__/build/web-build.test.ts
describe('Web Build Process', () => {
  test('build:web should preserve viewport meta tags', async () => {
    // Run build
    await exec('npm run build:web');

    // Check output
    const indexHtml = await fs.readFile('dist/index.html', 'utf-8');
    expect(indexHtml).toContain('user-scalable=no');
    expect(indexHtml).toContain('viewport-fit=cover');
  });
});
```

**GREEN** - Update build script if needed to inject meta tags.

#### Test 6.2: CSS Injection During Build
**RED** - Write failing test:
```typescript
test('should inject web-mobile-optimizations CSS during build', async () => {
  const indexHtml = await fs.readFile('dist/index.html', 'utf-8');
  expect(indexHtml).toContain('id="web-mobile-optimizations"');
  expect(indexHtml).toContain('touch-action: none');
  expect(indexHtml).toContain('overscroll-behavior: none');
});
```

**GREEN** - Create `scripts/inject-web-optimizations.js`:
```javascript
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const optimizationCSS = `
  <style id="web-mobile-optimizations">
    * { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    html, body { touch-action: none; overscroll-behavior: none; position: fixed; width: 100%; height: 100%; }
    #root { touch-action: none; overscroll-behavior: none; }
  </style>
`;

// Inject before </head>
html = html.replace('</head>', `${optimizationCSS}</head>`);

fs.writeFileSync(indexPath, html);
console.log('✅ Web mobile optimizations injected');
```

Update `package.json`:
```json
"build:web": "expo export --platform web && node scripts/fix-github-pages.js && node scripts/inject-web-optimizations.js"
```

### Phase 7: Manual Testing Protocol

#### Manual Test Suite (Not Automated)
1. **iOS Safari Testing**
   - [ ] Open app in Safari on iPhone
   - [ ] Attempt double-tap zoom → Should not zoom
   - [ ] Attempt pinch zoom → Should not zoom
   - [ ] Swipe down at top → Should not trigger pull-to-refresh
   - [ ] Tap score button rapidly → No selection highlighting
   - [ ] Rotate device → Layout switches properly
   - [ ] Add to Home Screen → Opens fullscreen without Safari UI

2. **Chrome Mobile Testing**
   - [ ] Same tests as iOS Safari
   - [ ] Check pull-to-refresh is disabled
   - [ ] Verify overscroll glow effect is disabled

3. **Firefox Mobile Testing**
   - [ ] Same core interaction tests

4. **Notched Device Testing (iPhone X+)**
   - [ ] Top tally badge not obscured by notch
   - [ ] Bottom controls above home indicator
   - [ ] Safe areas respected in landscape

## Architecture Changes

### Files Modified
1. `dist/index.html` - Meta tags, global CSS
2. `app.json` - Web orientation config
3. `src/components/GameScreen.tsx` - Web-specific touch-action styles
4. `package.json` - Build script updates
5. `scripts/inject-web-optimizations.js` - NEW

### Files Created
1. `public/manifest.json` - PWA manifest
2. `scripts/inject-web-optimizations.js` - Build script
3. `__tests__/web/viewport.test.ts` - NEW
4. `__tests__/web/touch-behavior.test.tsx` - NEW
5. `__tests__/web/responsive.test.tsx` - NEW
6. `__tests__/build/web-build.test.ts` - NEW
7. `__tests__/config/app.config.test.ts` - NEW

## Test Categories

### Unit Tests
- ✅ Viewport meta tag parsing
- ✅ App config validation
- ✅ PWA manifest structure

### Integration Tests
- ✅ Touch behavior with React Native Web
- ✅ CSS injection during build
- ✅ Orientation change handling

### E2E Tests (Manual)
- ⚠️ Real device testing on iOS/Android browsers
- ⚠️ PWA installation flow
- ⚠️ Safe area inset rendering on notched devices

## Definition of Done

- [ ] All TDD tests passing (100% coverage for new code)
- [ ] Viewport meta tag prevents scaling
- [ ] Touch-action CSS prevents zoom/refresh
- [ ] PWA manifest enables "Add to Home Screen"
- [ ] Safe area insets respected on notched devices
- [ ] Build script successfully injects optimizations
- [ ] Manual testing completed on iOS Safari, Chrome Mobile, Firefox Mobile
- [ ] No regressions on native iOS/Android builds
- [ ] Lighthouse accessibility score 100%
- [ ] Documentation updated in CLAUDE.md

## Acceptance Criteria

1. User opens app in mobile browser → No zoom on double-tap/pinch
2. User scrolls down from top → No pull-to-refresh triggered
3. User adds to home screen → App opens fullscreen like native app
4. User rotates device → Layout switches smoothly without flicker
5. User taps score on iPhone 14 Pro → Touch responds within 100ms
6. User views on iPhone X+ → Content not obscured by notch/home indicator
7. All existing native platform functionality remains unchanged

## Rollback Plan

If web optimizations break native platforms:
1. Revert CSS changes (they only apply to web via `react-native-web`)
2. Web-specific styles use `@ts-ignore` and won't affect native
3. Viewport meta tags only in `dist/index.html` (web-only)
4. PWA manifest is web-only, no impact on native

## Future Enhancements

- Service worker for offline support
- Web install prompt UI
- Screen wake lock during gameplay
- Web vibration API for haptic feedback
- Share score via Web Share API
