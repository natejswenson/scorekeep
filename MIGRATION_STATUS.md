# React Migration Status - Phase 1

## ✅ Completed

### Core Infrastructure
- ✅ Installed MUI 5 and Emotion dependencies
- ✅ Created centralized theme system in `src/theme/`
  - `palette.ts` - Team colors and neutral colors
  - `typography.ts` - Custom variants (score, gamesText, tallyText, etc.)
  - `breakpoints.ts` - Responsive breakpoints
  - `components.ts` - MUI component overrides
  - `index.ts` - Main theme export
- ✅ Updated `App.tsx` with `ThemeProvider` and `CssBaseline`
- ✅ Updated Jest config to use `jsdom` test environment
- ✅ Created `src/test-utils/test-utils.tsx` with `renderWithProviders` helper

### Component Migration
- ✅ Migrated `GameScreen.tsx` to MUI components
  - Replaced `View` with `Box`
  - Replaced `Text` with `Typography`
  - Replaced `TouchableOpacity` with `Button`/`IconButton`
  - Removed all `StyleSheet.create` usage
  - Applied styling via MUI `sx` prop and theme
  - Maintained landscape and portrait layouts
  - Preserved all testIDs

### Hooks
- ✅ Updated `useOrientation.ts` and `useIsLandscape.ts` for web
  - Replaced `useWindowDimensions` from React Native with `window.innerWidth`/`innerHeight`
  - Added `resize` event listeners
  - Updated tests to use `window` mocking

### Tests
- ✅ Theme configuration tests pass (9/9)
- ✅ useOrientation tests pass (8/8)
- ✅ Started updating `GameScreen.test.tsx` to use React Testing Library

## 🚧 In Progress / Remaining Work

### Test Migration
- ⚠️ 127 tests failing - most need conversion from React Native to React web:
  - Replace `fireEvent.press` with `fireEvent.click`
  - Replace `@testing-library/react-native` imports with `test-utils`
  - Update component rendering to use `renderWithProviders`
  - Remove React Native-specific mocks

### Key Test Files Needing Updates
- `__tests__/GameScreen.test.tsx` (partially updated)
- `__tests__/GameScreen.orientation.test.tsx`
- `__tests__/TeamWinsTally.*.test.tsx`
- `__tests__/web/*.test.tsx`
- All other test files using React Native Testing Library

### Build Configuration
- Need to remove Expo dependencies
- Update build scripts for standard React
- Configure bundler (Vite/Webpack/etc.) if removing Expo

### Dependencies to Remove
- `react-native`
- `react-native-web` (if not using Expo web)
- `expo` and expo packages (if going pure React)
- `@testing-library/react-native`
- `react-test-renderer`

### Documentation
- Update `CLAUDE.md` with new React/MUI architecture
- Update `README.md` with React-specific instructions
- Remove React Native-specific documentation

## 📊 Test Status

```
Test Suites: 15 failed, 9 passed, 24 total
Tests:       127 failed, 118 passed, 245 total
```

**Passing:**
- Theme tests
- useOrientation tests
- Some isolated unit tests

**Failing:**
- Most GameScreen integration tests (React Native → React web)
- Component tests using old test utilities
- Tests with React Native-specific assertions

## 🎯 Next Steps

1. **Complete Test Migration** (HIGH PRIORITY)
   - Systematically update each test file
   - Use find/replace for common patterns:
     - `fireEvent.press` → `fireEvent.click`
     - `@testing-library/react-native` → `test-utils`
     - Remove `useWindowDimensions` mocks

2. **Verify TypeScript** ✅ (DONE - passing)

3. **Run Linting**
   - Fix any lint errors from migration

4. **Achieve 90% Test Coverage**
   - After test migration, verify coverage threshold

5. **Update Documentation**
   - CLAUDE.md
   - README.md

6. **Remove Dead Code**
   - `GameScreen.old.tsx`
   - React Native-specific files

7. **Optional: Remove Expo Dependencies**
   - If going pure React, configure bundler
   - Update build scripts

## 💡 Key Decisions Made

1. **Theme Separation**: All styling moved to `src/theme/`, components use `sx` prop
2. **Test Strategy**: Created `renderWithProviders` helper for consistent test setup
3. **jsdom**: Using jsdom test environment for DOM/web testing
4. **Preserved Structure**: Kept same file structure, Redux store unchanged
5. **Backwards Compatible testIDs**: All component testIDs remain the same

## 🔧 Technical Notes

- MUI theme defines custom Typography variants (score, gamesText, etc.)
- Theme palette preserves exact colors from original (#FF0000, #0000FF)
- `CssBaseline` normalizes browser styles
- `useIsLandscape` hook detects orientation via window dimensions
- Test utils wrap components in both Redux Provider and ThemeProvider

## ⚡ Performance Notes

- No performance regressions expected
- MUI uses Emotion for CSS-in-JS (cached)
- Theme object created once at app startup
- Event listeners properly cleaned up in hooks
