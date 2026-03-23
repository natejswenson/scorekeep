# GitHub Pages Documentation & Marketing Site — ScoreKeep iOS

## 1. Overview

### Purpose
Replace the existing React/Vite volleyball scorekeeping web app at `https://<user>.github.io/scorekeep/` with a single-page marketing and documentation site for the ScoreKeep iOS app. The site has two goals: (1) demonstrate the app's visual identity to prospective users, and (2) explain every feature with enough detail that a new user can pick up the app and use it without friction.

### Goals
- Visually feel like an extension of the iOS app: dark background, split blue/red gradient, Digital-7 scoreboards, white-on-dark typography.
- Document every user-facing feature: scoring, chip panels, menu, volleyball sets, history, settings.
- Use production-ready copy throughout — no placeholders.
- Deploy automatically from the existing GitHub Actions workflow with **zero changes** to the workflow file.

### Non-goals
- No App Store button or link anywhere on the page.
- No interactive scorekeeping game (that is the old app — being replaced entirely).
- No server-side rendering, no database, no authentication.

### Hard Constraints
1. The GitHub Actions workflow (`/.github/workflows/deploy-pages.yml`) must pass without modification. It runs: `npm ci --legacy-peer-deps` → `npm run typecheck` → `npm run lint` → `npm run build` → copies `dist/index.html` to `dist/404.html` → uploads `./dist` to GitHub Pages.
2. The Vite `base` path remains `/scorekeep/` — all asset imports must go through Vite (ES module `import`) so the base path is applied automatically.
3. Build output directory remains `dist/`.
4. Node 18 is used by the runner.

---

## 2. Color Tokens

Derived from the iOS app's Classic theme and UI constants.

```ts
// Reference these values inline in CSS modules or a shared constants file
const tokens = {
  // Backgrounds
  pageBg:        '#000000',
  surfaceBg:     '#111111',
  cardBg:        '#1C1C1E',

  // Blue side (team 1 — Classic theme)
  blueTop:       '#3b75e9',
  blueBottom:    '#0e1e4a',

  // Red side (team 2 — Classic theme)
  redTop:        '#f32727',
  redBottom:     '#460808',

  // Text
  textPrimary:   '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted:     'rgba(255,255,255,0.30)',

  // Accents
  gold:          '#FFD700',
  divider:       'rgba(255,255,255,0.08)',
  border:        'rgba(255,255,255,0.12)',
};
```

---

## 3. Typography

### Digital-7 Font
The app ships `digital-7.ttf` at `ios/ScoreKeep/Resources/Fonts/`. Copy it to `src/assets/fonts/` during implementation.

Load via `@font-face` in `src/index.css`:
```css
@font-face {
  font-family: 'Digital-7';
  src: url('./assets/fonts/digital-7.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```
Vite resolves the relative URL and hashes/copies the file into `dist/`.

### Body Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
| Role             | Size                      | Weight | Notes                              |
|-----------------|---------------------------|--------|------------------------------------|
| Hero score      | `clamp(80px, 18vw, 160px)` | normal | Digital-7, decorative watermark    |
| H1 (hero)       | `clamp(40px, 7vw, 64px)`  | 800    | White, letter-spacing -0.02em      |
| Tagline         | `clamp(18px, 3vw, 24px)`  | 400    | `rgba(255,255,255,0.80)`           |
| H2 (section)    | `clamp(28px, 5vw, 40px)`  | 700    | White                              |
| Sub-heading     | 20–24px                   | 600    | White                              |
| Body            | 16–18px                   | 400    | `rgba(255,255,255,0.70)`           |
| Caption         | 13–14px                   | 400    | `rgba(255,255,255,0.45)`           |
| Feature label   | 12px                      | 600    | Uppercase, letter-spacing: 0.1em   |

---

## 4. Screenshot Assets

### Source
Four simulator screenshots are required. If the temp paths have expired, re-capture from Xcode Simulator using `File > Save Screen` or:
```bash
xcrun simctl io booted screenshot <filename>.png
```

| Destination filename              | Description                                                                           |
|-----------------------------------|---------------------------------------------------------------------------------------|
| `portrait-volleyball-game.png`    | Portrait volleyball game — NUGGETS 6 vs REBELS 7, NEXT SET button at center divider  |
| `landscape-volleyball-game.png`   | Landscape volleyball game — same teams, landscape split                               |
| `menu-open.png`                   | Drawer menu open over game — rows: Sport, New Game, History, Help, Settings           |
| `settings.png`                    | Settings sheet — themes, volleyball section, timer, display, feedback                 |

### Destination
Copy all four to `src/assets/screenshots/`. Import via ES module in each component:
```ts
import portraitVolleyball from '../assets/screenshots/portrait-volleyball-game.png';
```
Vite will hash filenames and embed the correct `/scorekeep/` base path automatically.

### Performance Note
Compress each screenshot to ≤ 200 KB using `squoosh` or `imageoptim` before committing. Vite does not compress PNG assets. Use `loading="lazy"` on all images below the fold.

---

## 5. Page Sections

The entire site is a single HTML document. There is no client-side routing. All sections are stacked vertically and scrollable. Section order:

1. Hero
2. Features Strip
3. How to Score
4. The Menu
5. Volleyball Deep Dive
6. Game History
7. Settings
8. Footer

---

### 5.1 Hero Section

**Component:** `HeroSection`

**Layout:** Full viewport height (`100dvh`). Two-column flex layout on desktop (≥768px): text content left, phone frame right. On mobile (<768px): text on top, phone frame below, single column.

**Background — split gradient replicating the app:**
```css
.heroBg {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 0;
}
.heroBgLeft {
  flex: 1;
  background: linear-gradient(to bottom, #3b75e9, #0e1e4a);
}
.heroBgRight {
  flex: 1;
  background: linear-gradient(to bottom, #f32727, #460808);
}
```

**Hairline divider:** `position: absolute; left: 50%; top: 0; bottom: 0; width: 0.5px; background: rgba(255,255,255,0.12)`.

**Digital-7 score watermark (decorative):**
- Two `<span>` elements: `07` in white on the blue half, `06` in white on the red half.
- Font: Digital-7, `clamp(80px, 18vw, 160px)`.
- `position: absolute`, centered in the viewport, `opacity: 0.12`.
- `pointer-events: none; user-select: none`.
- This gives depth without obscuring the phone frame or text.

**Left column content (z-index above background):**
- `<h1>ScoreKeep</h1>` — see type scale, white, letter-spacing -0.02em.
- `<p>The cleanest scorekeeping app for every sport.</p>` — tagline, max-width 420px.
- No CTA button.
- Align: center-left on desktop, centered on mobile.

**Right column content:**
- `<PhoneFrame>` wrapping `portrait-volleyball-game.png`.
- Max height: `min(70dvh, 540px)`. Width auto (aspect ratio ~390/844).
- On mobile: `width: 55vw`, centered.

---

### 5.2 Features Strip

**Component:** `FeatureStrip`

**Layout:** Full-width strip, `background: #111111`, padding `56px 24px`. Four cards in a horizontal row (≥768px), 2×2 grid (480–767px), single column (<480px).

**Card style:**
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 12px;
padding: 28px 24px;
```

**Four features:**

| Icon             | Label (uppercase, muted) | Value/Description                             |
|-----------------|--------------------------|-----------------------------------------------|
| ⚽ sport icon   | SPORTS                   | Volleyball, Basketball, Football, Soccer       |
| ◆ diamond       | DESIGN                   | Clean & minimal — nothing in the way          |
| ⟳ rotate        | ORIENTATION              | Portrait & Landscape, always crisp            |
| ◐ palette       | THEMES                   | Five color themes, more coming                |

Use simple Unicode characters or inline SVGs (12–16px stroke icons). Color: `rgba(255,255,255,0.50)` for icons, `rgba(255,255,255,0.35)` for labels, white for values.

---

### 5.3 How to Score

**Component:** `HowToScore`

**Layout:** `SectionLayout` — phone frame left, text right, `background: #000000`, desktop `min-height: 600px`.

**Screenshot:** `portrait-volleyball-game.png` in `<PhoneFrame>`, max-height 500px.

**H2:** `Scoring is as simple as it gets.`

**Content (structured as prose paragraphs, not a bare list):**

> **Tap anywhere on your side** to add a point. The entire half of the screen is your scoring zone — no tiny buttons to aim for.
>
> **Made a mistake?** Tap the − circle at the bottom of your side to subtract one point. It fades out when the score is already 0 so you always know it's safe to use.

**Sub-heading:** Basketball & Football

> Before tapping your side, choose a point value from the chip panel at the center of the screen. Basketball chips are labeled **3**, **2**, and **1**. Football chips are **6**, **3**, **2**, and **1**. Tap a chip to select it — it lights up to confirm your choice — then tap your side to score that value. Your selection stays active until you change it.

**Sub-heading:** Volleyball & Soccer

> Every tap scores exactly 1 point. No chip selection needed.

**Sub-heading:** Rename teams

> Tap any team name at the top of its half to rename it. Names save automatically and appear in game history.

---

### 5.4 The Menu

**Component:** `MenuSection`

**Layout:** `SectionLayout` — text left, phone frame right (`reverse` prop), `background: #111111`.

**Screenshot:** `menu-open.png` in `<PhoneFrame>`, max-height 500px.

**H2:** `Everything in one swipe.`

**Intro:**
> Swipe down anywhere on the game screen to open the menu. No hamburger button, no navigation bar — just a natural gesture that keeps the scoring interface completely clean.

**Menu items — render as a styled definition list or card list:**

```
Sport        Switch between Volleyball, Basketball, Football, and Soccer.
             Scores and history are tracked independently per sport.

New Game     Reset all scores and start fresh. A brief undo toast lets you
             reverse an accidental tap.

History      Every game you've played, saved automatically. Volleyball
             games are expandable to show per-set scores.

Help         Opens the in-app tutorial — good for first-time users or
             when trying a new sport.

Settings     Themes, volleyball rules, timer, display, and haptic options.
```

Style each row to visually echo the real drawer: icon + label left, chevron right, subtle divider between rows, dark card background.

**Timer note:**
> When a timer is enabled in Settings, a live clock row appears at the top of the menu. Tap to pause or resume; long-press to reset. Count Down turns gold when expired.

---

### 5.5 Volleyball Deep Dive

**Component:** `VolleyballSection`

**Layout:** `SectionLayout` — screenshot left, text right, `background: #000000`.

**Screenshot:** `landscape-volleyball-game.png`. Because this is a wide landscape image, present it free-floating (no `PhoneFrame`), `border-radius: 16px`, `transform: rotate(-1.5deg)`, `box-shadow: 0 24px 80px rgba(0,0,0,0.8)`, max-width 560px, `width: 100%`.

**H2:** `Built for volleyball.`

**Intro:**
> Volleyball has rules that most scorekeeper apps ignore. ScoreKeep handles every detail — sets, win-by-two, deciding set scoring, and full match tracking — so you can focus on the game.

**Feature cards (render as a stacked list of titled cards with `background: #1C1C1E; border-radius: 10px; padding: 20px 24px`):**

**Sets tracked automatically**
Every time a team wins a set, their WINS counter increments and both scores reset to zero. No mid-game configuration needed.

**NEXT SET button**
A circular hold-to-confirm button sits at the center divider. Hold it for about a second — the progress ring fills — and the set advances. The hold requirement prevents accidental taps in the heat of a game.

**Auto-Advance**
Turn on Auto-Advance in Settings → Volleyball, and the app will detect win-by-two conditions and prompt you automatically. Never miss a set transition.

**Best Of 3, 5, or 7**
Set the match length in Settings. The app tracks set wins and shows a Match Won overlay — winner's name in gold, dark backdrop — when one team clinches. Tap New Match to start over.

**Final Set Score**
The deciding set uses its own score cap, configurable from 5 to 30 (default 15). Win-by-two always applies.

---

### 5.6 Game History

**Component:** `HistorySection`

**Layout:** Full-width, text-only. `background: #111111`. Content centered in a `max-width: 760px` column, generous padding.

**H2:** `Every game remembered.`

**Intro:**
> ScoreKeep saves every game automatically as you play — nothing to confirm, nothing to remember. Open History from the menu at any time to see the full record.

**Feature list (render as a styled `<ul>` with subtle separator lines):**

- Every game is saved with team names, date, time, and final score.
- **Volleyball games** show the total sets won. Tap any volleyball row to expand it and see the score from each individual set.
- **Swipe left** on any row to delete that game.
- **Clear All** in the top-right removes the full history for the current sport.
- History is tracked per sport. Switch sports in the menu to view records for that sport.

---

### 5.7 Settings

**Component:** `SettingsSection`

**Layout:** `SectionLayout` — text left, phone frame right, `background: #000000`.

**Screenshot:** `settings.png` in `<PhoneFrame>`, max-height 560px.

**H2:** `Set it up your way.`

**Intro:**
> ScoreKeep is designed to stay out of your way — but when you need to configure something, Settings has it all in one place. Open it from the menu.

**Sub-sections (render as labeled groups separated by dividers):**

**Appearance — Five themes**
Classic keeps the look you know: deep navy blue and dark crimson red. Midnight goes all-black for the most minimal look. Teal & Fire, Violet & Gold, and Forest & Crimson offer bolder palettes for teams with strong colors.

| Theme name       | Left (team 1)         | Right (team 2)       |
|-----------------|-----------------------|----------------------|
| Classic          | #3b75e9 → #0e1e4a    | #f32727 → #460808   |
| Midnight         | #2c2c2e → #000000    | #3a3a3c → #0a0a0a   |
| Teal & Fire      | #0d9488 → #042f2e    | #ea580c → #431407   |
| Violet & Gold    | #7c3aed → #1e0a4a    | #d97706 → #431e00   |
| Forest & Crimson | #15803d → #052e16    | #be123c → #4c0519   |

**Volleyball**
Control Max Score (score turns gold when reached — set to 0 to disable), Auto-Advance, Best Of length, and Final Set Score without leaving the settings sheet.

**Timer**
Off by default. Count Up tracks elapsed time from the moment each game begins. Count Down starts a configurable countdown (1–120 minutes) and turns gold when time expires. The timer appears in the menu when active.

**Display**
Keep Screen On prevents the display from sleeping during a game — useful on a tablet mounted courtside.

**Haptic Feedback**
Subtle vibrations confirm every tap and scoring event. Toggle off for a silent experience.

---

### 5.8 Footer

**Component:** `Footer`

**Layout:** Full-width, `background: #000000`, `border-top: 1px solid rgba(255,255,255,0.08)`. Two rows, centered. Padding 40px vertical.

```
ScoreKeep                    ← 18px, weight 700, white
© 2025 ScoreKeep. All rights reserved.   ← 13px, rgba(255,255,255,0.30)
```

No links, no social icons, no App Store badge.

---

## 6. Component Architecture

### File structure

```
src/
├── assets/
│   ├── fonts/
│   │   └── digital-7.ttf          (copied from ios/ScoreKeep/Resources/Fonts/)
│   └── screenshots/
│       ├── portrait-volleyball-game.png
│       ├── landscape-volleyball-game.png
│       ├── menu-open.png
│       └── settings.png
├── components/
│   ├── HeroSection/
│   │   ├── HeroSection.tsx
│   │   └── HeroSection.module.css
│   ├── FeatureStrip/
│   │   ├── FeatureStrip.tsx
│   │   └── FeatureStrip.module.css
│   ├── HowToScore/
│   │   ├── HowToScore.tsx
│   │   └── HowToScore.module.css
│   ├── MenuSection/
│   │   ├── MenuSection.tsx
│   │   └── MenuSection.module.css
│   ├── VolleyballSection/
│   │   ├── VolleyballSection.tsx
│   │   └── VolleyballSection.module.css
│   ├── HistorySection/
│   │   ├── HistorySection.tsx
│   │   └── HistorySection.module.css
│   ├── SettingsSection/
│   │   ├── SettingsSection.tsx
│   │   └── SettingsSection.module.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── PhoneFrame/
│   │   ├── PhoneFrame.tsx
│   │   └── PhoneFrame.module.css
│   └── SectionLayout/
│       ├── SectionLayout.tsx
│       └── SectionLayout.module.css
├── declarations.d.ts              (new — type declarations for CSS modules and assets)
├── index.css                      (global reset + @font-face)
└── main.tsx                       (unchanged — imports index.css, mounts App)
App.tsx                            (replaced entirely)
```

### Key component interfaces

**`SectionLayout`**
```tsx
interface SectionLayoutProps {
  children: React.ReactNode;   // expects exactly two children: [media, text]
  reverse?: boolean;           // swaps column order on desktop
  background?: string;         // CSS color, default '#000000'
  maxWidth?: number;           // default 1200
}
```
On desktop (≥768px): two flex columns, 45%/55% split. On mobile: single column, `reverse` is ignored, media always above text.

**`PhoneFrame`**
```tsx
interface PhoneFrameProps {
  src: string;
  alt: string;
  maxHeight?: number;  // default 520, in px
}
```
Pure CSS frame: `border-radius: 12%`, `border: 2.5px solid rgba(255,255,255,0.10)`, `box-shadow: 0 32px 80px rgba(0,0,0,0.75)`, `overflow: hidden`, `background: #000`. Image inside: `width: 100%; height: 100%; object-fit: cover; display: block`.

**`App.tsx` (full replacement)**
```tsx
export default function App() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <HowToScore />
      <MenuSection />
      <VolleyballSection />
      <HistorySection />
      <SettingsSection />
      <Footer />
    </>
  );
}
```
No Redux Provider. No MUI ThemeProvider. No CssBaseline.

---

## 7. Styling Approach

- **CSS Modules** for all component-scoped styles.
- **No MUI**, no styled-components, no Tailwind. Zero CSS-in-JS.
- Inline styles only for dynamic/computed values (e.g., a prop-driven background color).
- Responsive breakpoints (mobile-first):
  - Default (< 480px)
  - `@media (min-width: 480px)` — tablet small
  - `@media (min-width: 768px)` — desktop
  - `@media (min-width: 1200px)` — wide desktop

### `src/index.css`
```css
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #000000;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
               'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}

@font-face {
  font-family: 'Digital-7';
  src: url('./assets/fonts/digital-7.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

---

## 8. TypeScript / ESLint Considerations

### `src/declarations.d.ts` (new file — required)
```ts
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}
```
Place in `src/` — it is automatically included by `tsconfig.json` (`"include": ["src", "App.tsx"]`).

### ESLint rules that will break the build if violated
The existing `eslint.config.js` enforces zero warnings:
- `@typescript-eslint/no-unused-vars: error` — every import must be used.
- `@typescript-eslint/no-explicit-any: error` — no `any` types.
- `no-console: warn` — counts as a warning, fails CI.

### Old source files — what to delete
Delete all files under `src/components/`, `src/store/`, `src/hooks/`, `src/theme/`, `src/types/`, and `src/test-utils/`. If any of these files import modules that no longer exist after the replacement, `npm run typecheck` will fail.

**Critical:** `src/test-utils/setup.ts` imports from testing libraries and possibly the old Redux store. If it remains in `src/`, TypeScript will try to type-check it. Either delete it or verify its imports still resolve.

**Tests:** The GHA workflow does **not** run `npm test`. Existing tests in `__tests__/` will fail (old components removed), but this does not block deployment.

### MUI and Redux packages
Do not remove from `package.json`. They remain as dependencies in `node_modules`. Since no new source file imports them, they have no effect on typecheck, lint, or build. Removing them would require regenerating `package-lock.json`, which risks breaking `npm ci --legacy-peer-deps`.

---

## 9. GHA Workflow — Changes Needed

**None.** The workflow file (`deploy-pages.yml`) requires zero modifications.

| Step                         | Status after replacement                                        |
|------------------------------|------------------------------------------------------------------|
| `npm ci --legacy-peer-deps`  | Same `package.json` — installs identically                       |
| `npm run typecheck`          | Passes if all new `.tsx` files are type-clean                    |
| `npm run lint`               | Passes if no unused vars, no `any`, no `console` in new files   |
| `npm run build`              | Vite builds new `App.tsx` → `dist/index.html`                   |
| `cp dist/index.html dist/404.html` | Still correct — GitHub Pages uses it for unknown paths     |
| Upload `./dist`              | Still correct — same output directory                           |
| Deploy to Pages              | Deploys at `/scorekeep/` — same base path                        |

---

## 10. Implementation Order

1. Delete old `src/` component/store/hook/theme/type/test-utils directories. Replace `App.tsx` with a minimal shell (`<div>ScoreKeep</div>`). Run `npm run typecheck && npm run lint && npm run build` — confirm the pipeline passes. **This is the baseline.**
2. Add `src/declarations.d.ts`. Add `src/index.css` with reset and `@font-face`. Update `src/main.tsx` to `import './index.css'`. Re-run pipeline.
3. Copy `digital-7.ttf` from `ios/ScoreKeep/Resources/Fonts/` to `src/assets/fonts/`.
4. Build `PhoneFrame` and `SectionLayout` (no screenshots yet, use `background: #1C1C1E` placeholder). Confirm build passes.
5. Build `HeroSection` — the watermark score digits use Digital-7 but require no screenshots. Confirm the split gradient renders correctly in `npm run preview`.
6. Re-capture or source the four simulator screenshots. Compress to ≤ 200 KB each. Copy to `src/assets/screenshots/`.
7. Build remaining sections in page order: `FeatureStrip` → `HowToScore` → `MenuSection` → `VolleyballSection` → `HistorySection` → `SettingsSection` → `Footer`.
8. Wire all sections into `App.tsx`.
9. Final pipeline check: `npm run typecheck && npm run lint && npm run build`.
10. Preview: `npm run preview` → open `http://localhost:4173/scorekeep/`. Verify all screenshots load, all sections render, font loads.
11. Commit to `main`. GHA deploys automatically.

---

## 11. Accessibility Baseline

- One `<h1>` (Hero), `<h2>` for each major section heading — no skipped levels.
- All `<img>` elements must have descriptive `alt` text (e.g., `alt="ScoreKeep portrait mode — volleyball game in progress"`).
- Text contrast: `rgba(255,255,255,0.70)` on `#111111` ≈ 8:1 ratio — WCAG AA pass.
- `loading="lazy"` on all images below the fold (everything except the hero phone frame).
- No interactive elements in v1, so no keyboard focus concerns.
