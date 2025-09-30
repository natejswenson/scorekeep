# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScoreKeep is a React Native volleyball scorekeeping app built with Expo. It provides a clean, ad-free interface for tracking scores between two teams with large touch targets optimized for mobile use.

## Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS device/simulator
- `npm run web` - Start web version (http://localhost:19006)

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report (90% threshold required)

### Code Quality
- `npm run lint` - Run ESLint (must pass with 0 warnings)
- `npm run typecheck` - Run TypeScript type checking

### Build
- `npm run build:web` - Build for web deployment with GitHub Pages fixes

## Architecture

### State Management
- **Redux Toolkit** for state management with a single `gameSlice`
- Store structure: `RootState = { game: GameState }`
- All game logic is handled through Redux actions (increment/decrement scores, reset, update teams)

### Component Structure
- **App.tsx** - Root component with Redux Provider
- **GameScreen.tsx** - Main game interface with red/blue team sides and centered reset button
- All components are in `src/components/`

### Key Types
- `Team` - { name, score, color }
- `GameState` - { team1, team2, scoreIncrement, winCondition, isGameActive, winner }
- Type definitions in `src/types/index.ts`

### Styling
- React Native StyleSheet with responsive design
- Red (#FF0000) vs Blue (#0000FF) team colors
- Large touch targets (150px score circles, 60px buttons)
- Centered reset button with shadow/elevation

### Testing
- Jest with React Native Testing Library
- Test setup in `src/test-utils/setup.ts`
- Coverage thresholds: 90% for branches, functions, lines, statements
- TestIDs used throughout for reliable testing

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
├── components/     # React components
├── store/         # Redux store and slices
├── types/         # TypeScript type definitions
└── test-utils/    # Testing utilities and setup
```

### Mobile-First Design
- Optimized for touch interaction with large target areas
- High contrast colors work in various lighting conditions
- No complicated menus or navigation during gameplay
- Cross-platform compatibility (iOS, Android, Web)