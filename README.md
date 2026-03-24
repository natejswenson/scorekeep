# SetScore — Promotional Site

Marketing and documentation site for the **SetScore** iOS app, published via GitHub Pages.

## About

This repository contains the promotional website for SetScore — a scorekeeping app for volleyball, basketball, football, and soccer on iOS.

- **Live site:** https://natejswenson.github.io/scorekeep
- **iOS app source:** https://github.com/natejswenson/SetScore

## Tech Stack

- React 18 + TypeScript
- Vite
- CSS Modules

## Local Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

The site is automatically deployed to GitHub Pages on every push to `main`.

## Structure

```
src/
├── components/
│   ├── Header/         # Desktop sticky nav
│   ├── HeroSection/    # Phone mockup + CTA
│   ├── ScoringSection/ # Gesture reference cards
│   ├── SportsSection/  # Four-sport overview
│   ├── VolleyballSection/
│   ├── MenuSection/
│   ├── SettingsSection/
│   └── Footer/
└── assets/
    └── screenshots/    # App simulator screenshots
```
