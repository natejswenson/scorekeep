# React Migration with Material-UI Theme Specification

## Overview
Convert the existing React Native (Expo) volleyball scorekeeping app to a pure React web application using Material-UI (MUI) with a clean separation of concerns between components and styling through MUI's theming system.

## Requirements

### Functional Requirements
- **FR1**: All existing game functionality must be preserved (score tracking, game wins, reset)
- **FR2**: Redux state management must remain unchanged
- **FR3**: Must use Material-UI components instead of React Native components
- **FR4**: Must implement MUI theme system for all styling
- **FR5**: Must support responsive design (desktop and mobile viewports)
- **FR6**: Must maintain red/blue team color scheme
- **FR7**: Must preserve landscape and portrait layout modes

### Non-Functional Requirements
- **NFR1**: Zero inline styles - all styling via MUI theme and sx prop
- **NFR2**: Component files should contain minimal style definitions
- **NFR3**: Theme configuration should be centralized and reusable
- **NFR4**: Must maintain 90% test coverage threshold
- **NFR5**: Must pass TypeScript type checking with strict mode
- **NFR6**: Must pass ESLint with 0 warnings

## TDD Plan

### Test-Driven Development Cycle

#### Phase 1: Setup and Configuration
**Red**: Write tests that fail because MUI dependencies don't exist
**Green**: Install MUI dependencies and create basic theme structure
**Refactor**: Organize theme files and ensure clean imports

#### Phase 2: Theme System
**Red**: Write tests for theme provider and theme structure
**Green**: Implement centralized theme with colors, typography, spacing
**Refactor**: Extract theme tokens, create theme variants if needed

#### Phase 3: Component Migration
**Red**: Write tests for each migrated component (GameScreen first)
**Green**: Convert React Native components to MUI components
**Refactor**: Remove inline styles, apply theme-based styling

#### Phase 4: Layout and Responsiveness
**Red**: Write tests for responsive behavior and orientation handling
**Green**: Implement MUI breakpoints and responsive layouts
**Refactor**: Consolidate responsive logic into theme or hooks

#### Phase 5: Integration and Cleanup
**Red**: Write integration tests for full app flow
**Green**: Remove all React Native dependencies
**Refactor**: Clean up unused files, optimize bundle

## Architecture Design

### New Dependencies
```json
{
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0"
}
```

### Dependencies to Remove
- `react-native`
- `react-native-web`
- `expo` and all expo packages
- `@testing-library/react-native`
- `react-test-renderer`

### File Structure
```
src/
├── theme/
│   ├── index.ts              # Main theme export
│   ├── palette.ts            # Color definitions
│   ├── typography.ts         # Font configurations
│   ├── components.ts         # MUI component overrides
│   └── breakpoints.ts        # Responsive breakpoints
├── components/
│   ├── GameScreen.tsx        # Migrated to MUI
│   └── __tests__/
│       └── GameScreen.test.tsx
├── store/                    # Unchanged
├── types/                    # Unchanged
└── hooks/
    └── useOrientation.ts     # Updated for web

App.tsx                       # Updated with ThemeProvider
```

### Theme Structure

#### Palette (src/theme/palette.ts)
```typescript
export const palette = {
  team1: {
    main: '#FF0000',
    light: 'rgba(255, 0, 0, 0.2)',
    dark: '#CC0000',
  },
  team2: {
    main: '#0000FF',
    light: 'rgba(0, 0, 255, 0.2)',
    dark: '#0000CC',
  },
  neutral: {
    white: '#FFFFFF',
    overlay: 'rgba(255, 255, 255, 0.95)',
    dark: '#333333',
  },
};
```

#### Component Mapping
| React Native | Material-UI | Notes |
|--------------|-------------|-------|
| View | Box | Use sx prop for styling |
| Text | Typography | Variant-based |
| TouchableOpacity | Button/IconButton | Use onClick |
| StyleSheet | Theme + sx | No StyleSheet.create |

## Implementation Phases

### Phase 1: Project Setup (TDD)
**Test Cases**:
- [ ] Theme provider renders without errors
- [ ] Theme colors are accessible via useTheme hook
- [ ] App renders with MUI ThemeProvider

**Implementation**:
1. Install MUI and Emotion dependencies
2. Remove React Native dependencies
3. Create `src/theme/index.ts` with basic theme
4. Update `App.tsx` to use ThemeProvider
5. Update `package.json` scripts for web-only testing

**Files Modified**:
- `package.json`
- `App.tsx`
- `src/theme/index.ts` (new)

### Phase 2: Theme Configuration (TDD)
**Test Cases**:
- [ ] Palette contains team1, team2, neutral colors
- [ ] Typography defines required variants
- [ ] Breakpoints match mobile/desktop requirements
- [ ] Component overrides apply correctly

**Implementation**:
1. Create `src/theme/palette.ts` with team colors
2. Create `src/theme/typography.ts` with score/label styles
3. Create `src/theme/components.ts` for Button/IconButton overrides
4. Create `src/theme/breakpoints.ts` for responsive design
5. Compose all theme modules in `src/theme/index.ts`

**Files Created**:
- `src/theme/palette.ts`
- `src/theme/typography.ts`
- `src/theme/components.ts`
- `src/theme/breakpoints.ts`

### Phase 3: Hook Migration (TDD)
**Test Cases**:
- [ ] useOrientation returns 'landscape' or 'portrait'
- [ ] Hook responds to window resize events
- [ ] Hook uses MUI breakpoints for orientation detection

**Implementation**:
1. Update `src/hooks/useOrientation.ts` to use window.matchMedia
2. Remove React Native Dimensions dependency
3. Integrate with MUI breakpoint system
4. Write tests using window.matchMedia mock

**Files Modified**:
- `src/hooks/useOrientation.ts`
- `src/hooks/__tests__/useOrientation.test.ts`

### Phase 4: GameScreen Migration (TDD)
**Test Cases**:
- [ ] Score displays and increments correctly
- [ ] Decrement buttons work and prevent negative scores
- [ ] Reset button clears scores
- [ ] Game wins increment/decrement correctly
- [ ] Tally badge displays current game wins
- [ ] Team sides render with correct colors
- [ ] Landscape and portrait layouts render correctly
- [ ] All interactive elements have test IDs

**Implementation**:
1. Replace View with Box
2. Replace Text with Typography
3. Replace TouchableOpacity with Button/IconButton
4. Remove StyleSheet, apply styles via sx prop and theme
5. Use theme.palette for colors
6. Use theme.breakpoints for responsive layout
7. Update test file to use @testing-library/react

**Files Modified**:
- `src/components/GameScreen.tsx`
- `src/components/__tests__/GameScreen.test.tsx`

### Phase 5: Testing Infrastructure (TDD)
**Test Cases**:
- [ ] Test setup provides theme context
- [ ] Redux store mocking works
- [ ] Custom render function wraps ThemeProvider + Provider
- [ ] Coverage thresholds maintained at 90%

**Implementation**:
1. Update `src/test-utils/setup.ts` for React (not React Native)
2. Create custom render with ThemeProvider + Redux Provider
3. Update Jest config to use jsdom environment
4. Remove jest-expo preset, use standard Jest
5. Update transform patterns for web

**Files Modified**:
- `src/test-utils/setup.ts`
- `jest.config.js` (or package.json jest config)

### Phase 6: Build Configuration (TDD)
**Test Cases**:
- [ ] App builds successfully for production
- [ ] No React Native imports in final bundle
- [ ] Bundle size is reasonable
- [ ] TypeScript compilation succeeds

**Implementation**:
1. Update build scripts for standard React app
2. Configure Vite or Create React App (or keep existing web setup)
3. Remove Expo-specific build scripts
4. Update GitHub Pages deployment if needed
5. Update `.gitignore` for new build artifacts

**Files Modified**:
- `package.json`
- Build configuration files
- `scripts/` folder

### Phase 7: Cleanup (TDD)
**Test Cases**:
- [ ] No unused imports
- [ ] No React Native references
- [ ] Linting passes with 0 warnings
- [ ] Type checking passes
- [ ] All tests pass with 90%+ coverage

**Implementation**:
1. Remove unused React Native files
2. Remove Expo configuration files
3. Update README/CLAUDE.md documentation
4. Run final lint/typecheck/test pass
5. Verify all functionality in browser

**Files Removed**:
- Expo-specific config files
- React Native specific code

**Files Modified**:
- `README.md`
- `CLAUDE.md`

## Testing Strategy

### Unit Tests
- Theme configuration exports correct values
- Theme hooks return expected data
- Individual components render with theme styles
- Redux actions still work (unchanged)

### Integration Tests
- GameScreen integrates with Redux store
- Theme provider cascades to all components
- Orientation hook triggers layout changes
- User interactions dispatch correct actions

### Visual Regression Tests (Optional)
- Screenshot tests for landscape/portrait modes
- Color contrast verification
- Responsive layout breakpoints

### E2E Tests (Manual)
- Full game flow: increment, decrement, reset
- Game wins tracking across multiple rounds
- Responsive behavior on different screen sizes
- Touch/click interactions work as expected

## Test Files

### src/theme/__tests__/theme.test.ts
```typescript
describe('Theme Configuration', () => {
  it('should export a valid MUI theme object')
  it('should contain team1 palette with main/light/dark')
  it('should contain team2 palette with main/light/dark')
  it('should define typography variants for score')
  it('should define breakpoints for mobile/desktop')
})
```

### src/components/__tests__/GameScreen.test.tsx
```typescript
describe('GameScreen', () => {
  describe('Score Management', () => {
    it('should increment team1 score on click')
    it('should increment team2 score on click')
    it('should decrement scores with minus button')
    it('should not allow negative scores')
    it('should reset scores to 0')
  })

  describe('Game Wins Tracking', () => {
    it('should increment team1 wins')
    it('should increment team2 wins')
    it('should decrement wins')
    it('should not allow negative wins')
    it('should display tally badge with current wins')
  })

  describe('Layout and Styling', () => {
    it('should render landscape layout on wide screens')
    it('should render portrait layout on narrow screens')
    it('should apply team1 red background color from theme')
    it('should apply team2 blue background color from theme')
    it('should use theme typography for score display')
  })

  describe('Interactions', () => {
    it('should handle rapid score increments')
    it('should show reset button at midline')
    it('should show tally badge at top')
  })
})
```

### src/hooks/__tests__/useOrientation.test.ts
```typescript
describe('useOrientation', () => {
  it('should return "landscape" for wide viewports')
  it('should return "portrait" for narrow viewports')
  it('should update on window resize')
  it('should cleanup listeners on unmount')
})
```

## Definition of Done

### Code Quality
- [ ] All TypeScript strict mode checks pass
- [ ] ESLint shows 0 warnings
- [ ] No unused imports or variables
- [ ] No `any` types without justification
- [ ] All functions have return type annotations

### Testing
- [ ] 90%+ coverage on branches, functions, lines, statements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual E2E verification complete

### Documentation
- [ ] CLAUDE.md updated with new architecture
- [ ] README.md reflects React (not React Native) setup
- [ ] Theme documentation added
- [ ] Component API documented (if needed)

### Functionality
- [ ] All existing features work identically
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile and desktop
- [ ] Performance is acceptable (no lag on interactions)

### Build and Deploy
- [ ] Production build succeeds
- [ ] Bundle size is reasonable
- [ ] App deploys successfully to GitHub Pages (if applicable)
- [ ] No broken links or missing assets

## Acceptance Criteria

### User Experience
1. App loads quickly in browser
2. Score increments immediately on click
3. UI is responsive and adapts to screen size
4. Colors match original design (red vs blue)
5. Touch targets are appropriately sized
6. No visual bugs or layout issues

### Technical
1. Zero React Native dependencies in package.json
2. All styling comes from MUI theme system
3. No StyleSheet.create usage
4. Theme is centralized in src/theme/
5. Components are clean and focused on logic
6. Test coverage meets 90% threshold

### Maintainability
1. New developers can understand theme structure
2. Adding new colors/styles is straightforward
3. Components are testable in isolation
4. Theme can be easily extended or customized
5. Code follows React and MUI best practices

## Migration Checklist

- [ ] Phase 1: Project Setup complete
- [ ] Phase 2: Theme Configuration complete
- [ ] Phase 3: Hook Migration complete
- [ ] Phase 4: GameScreen Migration complete
- [ ] Phase 5: Testing Infrastructure complete
- [ ] Phase 6: Build Configuration complete
- [ ] Phase 7: Cleanup complete
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Production build verified
- [ ] Definition of Done met
- [ ] Acceptance Criteria met

## Risk Mitigation

### Risk: Breaking existing functionality
**Mitigation**: Write comprehensive tests before migration, maintain test coverage throughout

### Risk: Theme system too complex
**Mitigation**: Start simple, iterate based on needs, follow MUI best practices

### Risk: Performance degradation
**Mitigation**: Profile before/after, use React DevTools Profiler, optimize renders

### Risk: Responsive design issues
**Mitigation**: Test on multiple screen sizes, use browser dev tools, follow mobile-first approach

### Risk: Loss of orientation detection
**Mitigation**: Implement robust useOrientation hook with tests, use standard web APIs

## Success Metrics

1. **Test Coverage**: Maintain 90%+ across all metrics
2. **Build Success**: Zero errors in production build
3. **Code Quality**: Zero ESLint warnings, zero TypeScript errors
4. **Performance**: No perceptible lag on user interactions
5. **Bundle Size**: Comparable or smaller than React Native Web version
6. **User Experience**: All existing functionality works identically

## Notes

- Keep Redux store completely unchanged (no need to test/modify)
- Focus on clean separation between theme and components
- Use MUI's `sx` prop for component-specific styles
- Use theme for all colors, spacing, typography
- Maintain TDD discipline throughout migration
- Write tests first, then implement features
- Refactor after green tests to improve code quality
