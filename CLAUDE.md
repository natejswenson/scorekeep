# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScoreKeep is a **pure React web application** for volleyball scorekeeping built with **Material-UI (MUI)** and **Vite**. It provides a clean, ad-free interface for tracking scores between two teams with responsive design optimized for both desktop and mobile browsers.

**Tech Stack:**
- React 18
- Material-UI (MUI) v5
- Redux Toolkit
- Vite (build system)
- TypeScript
- Jest + React Testing Library

## Commands

### Development
- `npm run dev` - Start Vite dev server (http://localhost:3000)

### Build
- `npm run build` - Build optimized production bundle to `dist/`
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report (90% threshold required)

### Code Quality
- `npm run lint` - Run ESLint (must pass with 0 warnings)
- `npm run typecheck` - Run TypeScript type checking

## Architecture

### State Management
- **Redux Toolkit** for state management with a single `gameSlice`
- Store structure: `RootState = { game: GameState }`
- All game logic is handled through Redux actions (increment/decrement scores, reset, update teams)

### Component Structure
- **App.tsx** - Root component with Redux Provider, MUI ThemeProvider, CssBaseline
- **GameScreen.tsx** - Main game interface (MUI components: Box, Typography, Button, IconButton)
- **src/main.tsx** - React entry point (ReactDOM.createRoot)
- **index.html** - HTML entry point with root div
- All components are in `src/components/`

### Key Types
- `Team` - { name, score, color }
- `GameState` - { team1, team2, scoreIncrement, winCondition, isGameActive, winner, gameWins }
- Type definitions in `src/types/index.ts`

### Styling (MUI Theme System)
- **Centralized theme** in `src/theme/` with clean separation from components
- All styling via MUI `sx` prop and theme tokens (zero StyleSheet usage)
- **Theme Structure:**
  - `palette.ts` - Team colors (red #FF0000, blue #0000FF), neutral colors
  - `typography.ts` - Custom variants (score, gamesText, gamesLabel, tallyText, etc.)
  - `breakpoints.ts` - Responsive breakpoints
  - `components.ts` - MUI component overrides (Button, IconButton, CssBaseline)
  - `index.ts` - Main theme export
- **CssBaseline** normalizes browser styles
- **Responsive design** with landscape/portrait layouts

### Testing
- **Jest** with **jsdom** test environment
- **React Testing Library** (replaced React Native Testing Library)
- Test setup in `src/test-utils/setup.ts`
- **Custom render helper:** `renderWithProviders` wraps components with Redux + Theme providers
- Coverage thresholds: 90% for branches, functions, lines, statements
- TestIDs used throughout (data-testid) for reliable testing

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration enforces no unused vars, no explicit any, console warnings
- Test files ignored by linter (in `__tests__/` or `*.test.{ts,tsx}`)

### TDD Approach
The project follows Test-Driven Development principles as outlined in SPEC.md. Always write tests first for new features.

### Key Implementation Details
- Scores cannot go below 0 (enforced in reducers)
- Score increment is configurable (default: 1)
- Win condition tracking (default: 10 points)
- Team customization with names and colors
- Planned features: data persistence, game history, timer functionality

### File Organization
```
src/
├── components/        # React components (MUI-based)
├── theme/            # MUI theme configuration
│   ├── palette.ts    # Color definitions
│   ├── typography.ts # Font variants
│   ├── breakpoints.ts # Responsive breakpoints
│   ├── components.ts # MUI overrides
│   └── index.ts      # Main theme export
├── hooks/            # Custom React hooks (useOrientation, useIsLandscape)
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
├── test-utils/       # Testing utilities and setup
│   ├── setup.ts      # Jest configuration
│   └── test-utils.tsx # renderWithProviders helper
└── main.tsx          # React entry point

Root files:
├── index.html         # HTML entry point
├── vite.config.ts    # Vite configuration
└── App.tsx           # Root component with providers
```

### Responsive Web Design
- Optimized for desktop and mobile browsers
- Click/touch interaction with appropriately sized targets
- High contrast colors work in various lighting conditions
- No complicated menus or navigation during gameplay
- **Landscape Mode**: Side-by-side team layout
  - Team sides split 50/50 horizontally
  - Scores displayed prominently in each side
  - Reset button and tally badge centered
- **Portrait Mode**: Vertical split layout
  - Team sides split 50/50 vertically
  - Scores optimized for vertical space
  - Reset button at midline, tally badge at top
- **Orientation Detection**: `useOrientation` hook via window.innerWidth/innerHeight
- **Responsive Styling**: MUI breakpoints and sx prop for adaptive layouts