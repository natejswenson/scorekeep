# Responsive Tally Position Based on Orientation - TDD Specification

## Overview
Make the Games Won tallies position-aware based on device orientation:
- **Landscape mode**: Position tallies horizontally (left/right sides of team areas, centered vertically)
- **Portrait mode**: Keep current position (bottom of each team section)

This provides better space utilization and prevents layout crowding in different orientations.

## Requirements

### Functional Requirements
1. **FR1**: Detect device orientation (landscape vs portrait)
2. **FR2**: In landscape mode, position Team 1 Games Won on left side of red area, centered vertically
3. **FR3**: In landscape mode, position Team 2 Games Won on right side of blue area, centered vertically
4. **FR4**: In portrait mode, keep Games Won at bottom of each team section (current behavior)
5. **FR5**: Orientation changes must update layout dynamically in real-time
6. **FR6**: All other functionality (scoring, tally controls, reset) must remain unchanged
7. **FR7**: Games Won text and count must remain readable in both orientations
8. **FR8**: Touch targets must remain accessible in both orientations

### Non-Functional Requirements
1. **NFR1**: All existing tests must continue to pass
2. **NFR2**: Test coverage must remain ≥90%
3. **NFR3**: Zero ESLint warnings
4. **NFR4**: Zero TypeScript errors
5. **NFR5**: Smooth transition when orientation changes (no layout jumps)
6. **NFR6**: Performance: orientation detection must not cause lag
7. **NFR7**: Cross-platform compatibility (iOS, Android, Web)

## Current vs Target Layouts

### Portrait Mode (Current and Target - Same)
```
+------------------+
|  Team 1  Team 2  |
|    (🔴)  (🔵)   |
|                  |
|    [75]  [82]    |
|     (-)   (-)    |
|                  |
| Games Won        |
|    [3]           |
|         Games Won|
|           [2]    |
+------------------+
```

### Landscape Mode (Current - Needs Change)
```
+----------------------------------------+
| Team 1         [Controls]      Team 2 |
|  (🔴)           Game 6          (🔵)  |
| [75] (-)                       [82] (-)|
|                                        |
| Games Won                    Games Won |
|   [3]                           [2]    |
|               [Reset]                  |
+----------------------------------------+
```

### Landscape Mode (Target Layout)
```
+----------------------------------------+
| Team 1         [Controls]      Team 2 |
|  (🔴)           Game 6          (🔵)  |
|                                        |
| [75]                               [82]|
|  (-)    Games      [Reset]  Games   (-)|
|          Won                 Won       |
|          [3]                 [2]       |
+----------------------------------------+
```

## Technical Approach

### React Native Dimensions API
Use `Dimensions` and `useWindowDimensions` hook to detect orientation:
- Landscape: `width > height`
- Portrait: `height > width`

### Implementation Strategy
1. Add orientation state to GameScreen component
2. Apply conditional styling based on orientation
3. Position Games Won tallies:
   - Portrait: Bottom of team section (current: `justifyContent: 'space-between'`)
   - Landscape: Centered vertically on left/right edges

## TDD Implementation Plan

### Phase 1: Orientation Detection (RED-GREEN-REFACTOR)

#### RED - Write Failing Tests

**Test File**: `__tests__/GameScreen.orientation.test.tsx` (new file)

```typescript
describe('GameScreen Orientation Handling', () => {
  describe('Orientation Detection', () => {
    test('should detect landscape orientation when width > height', () => {
      // Mock window dimensions: 800x400 (landscape)
      // Verify orientation state is 'landscape'
    });

    test('should detect portrait orientation when height > width', () => {
      // Mock window dimensions: 400x800 (portrait)
      // Verify orientation state is 'portrait'
    });

    test('should update orientation when dimensions change', () => {
      // Start with portrait, change to landscape
      // Verify orientation updates
    });
  });

  describe('Tally Position in Portrait', () => {
    test('should position Games Won at bottom of team sections', () => {
      // Mock portrait dimensions
      // Verify teamSide uses justifyContent: 'space-between'
      // Verify Games Won is last child in team sections
    });

    test('should maintain vertical layout in portrait', () => {
      // Verify team section flexDirection is 'column'
    });
  });

  describe('Tally Position in Landscape', () => {
    test('should position Team 1 Games Won on left side in landscape', () => {
      // Mock landscape dimensions
      // Verify Team 1 Games Won has position: 'absolute'
      // Verify left positioning
      // Verify vertical centering (top: 50%, transform)
    });

    test('should position Team 2 Games Won on right side in landscape', () => {
      // Mock landscape dimensions
      // Verify Team 2 Games Won has position: 'absolute'
      // Verify right positioning
      // Verify vertical centering
    });

    test('should remove Games Won from normal flow in landscape', () => {
      // Verify teamSide layout doesn't include Games Won in space-between
    });
  });

  describe('Responsive Behavior', () => {
    test('should transition from portrait to landscape', () => {
      // Start portrait, switch to landscape
      // Verify layout changes
    });

    test('should transition from landscape to portrait', () => {
      // Start landscape, switch to portrait
      // Verify layout reverts
    });

    test('should handle rapid orientation changes', () => {
      // Toggle orientation multiple times quickly
      // Verify no errors or layout issues
    });
  });

  describe('Component Independence', () => {
    test('should not affect scoring functionality', () => {
      // Test scoring in both orientations
    });

    test('should not affect tally controls', () => {
      // Test increment/decrement in both orientations
    });

    test('should not affect reset button', () => {
      // Test reset in both orientations
    });
  });
});
```

**Test File**: `__tests__/TeamWinsTally.orientation.test.tsx` (new file)

```typescript
describe('TeamWinsTally Orientation Support', () => {
  test('should accept isLandscape prop', () => {
    // Render with isLandscape=true and isLandscape=false
    // Verify component accepts prop
  });

  test('should apply landscape positioning styles when isLandscape=true', () => {
    // Render with isLandscape=true
    // Verify position: 'absolute'
    // Verify left/right positioning based on teamId
  });

  test('should apply portrait positioning when isLandscape=false', () => {
    // Render with isLandscape=false
    // Verify default positioning (relative)
  });

  test('should center vertically in landscape mode', () => {
    // Verify top: 50%, transform: translateY(-50%)
  });

  test('should maintain accessibility in both modes', () => {
    // Verify accessibility labels unchanged
  });
});
```

#### GREEN - Implement Minimal Code

**File**: `src/components/GameScreen.tsx`

Changes:
1. Import `useWindowDimensions` from 'react-native'
2. Add orientation detection logic
3. Pass `isLandscape` prop to TeamWinsTally components
4. Conditionally adjust teamSide styles

```typescript
import { useWindowDimensions } from 'react-native';

const GameScreen: React.FC = () => {
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;

  // ... existing code ...

  return (
    <View style={styles.container}>
      <View style={[
        styles.teamSide,
        styles.redSide,
        // In landscape, don't use space-between since tally is positioned absolutely
        !isLandscape && styles.teamSidePortrait
      ]}>
        {/* ... team content ... */}
        <TeamWinsTally
          teamId="team1"
          wins={gameWins.team1}
          isLandscape={isLandscape}
        />
      </View>
      {/* ... similar for team2 ... */}
    </View>
  );
};
```

**File**: `src/components/TeamWinsTally.tsx`

Changes:
1. Add `isLandscape` prop to interface
2. Add conditional styles for landscape positioning
3. Apply left/right positioning based on teamId in landscape mode

```typescript
interface TeamWinsTallyProps {
  teamId: 'team1' | 'team2';
  wins: number;
  isLandscape?: boolean;
}

const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  isLandscape = false,
}) => {
  const landscapeStyles = isLandscape ? {
    position: 'absolute',
    top: '50%',
    [teamId === 'team1' ? 'left' : 'right']: 10,
    transform: [{ translateY: -40 }],
  } : {};

  return (
    <View style={[styles.tallyContainer, landscapeStyles]}>
      {/* ... existing content ... */}
    </View>
  );
};
```

#### REFACTOR - Optimize and Clean

1. Extract orientation detection to custom hook: `useOrientation()`
2. Extract landscape positioning logic to constants
3. Add TypeScript types for orientation
4. Optimize re-renders with useMemo if needed

### Phase 2: Integration Testing (RED-GREEN-REFACTOR)

#### RED - Write Tests

```typescript
describe('Orientation Integration Tests', () => {
  test('should maintain all game functionality in landscape', () => {
    // Full game flow test in landscape
  });

  test('should maintain all game functionality in portrait', () => {
    // Full game flow test in portrait
  });

  test('should preserve state across orientation changes', () => {
    // Set scores, change orientation, verify scores unchanged
  });

  test('should position all UI elements correctly in both modes', () => {
    // Verify no overlaps in either mode
  });
});
```

#### GREEN - Ensure Integration Works

- Run full test suite
- Verify existing integration tests pass
- Fix any edge cases

#### REFACTOR - Polish

- Optimize component updates
- Add memoization if needed
- Clean up style calculations

### Phase 3: Visual Polish (RED-GREEN-REFACTOR)

#### RED - Write Visual Tests

```typescript
describe('Visual Layout in Both Orientations', () => {
  test('should maintain proper spacing in landscape', () => {
    // Verify no UI elements overlap
    // Verify readable font sizes
  });

  test('should maintain proper spacing in portrait', () => {
    // Verify current layout preserved
  });

  test('should handle edge cases (square screens)', () => {
    // Test with width === height
  });
});
```

#### GREEN - Implement Polish

- Fine-tune positioning values
- Adjust margins/padding if needed
- Ensure visual consistency

#### REFACTOR - Final Cleanup

- Document orientation behavior
- Add comments to complex positioning logic
- Extract magic numbers to constants

## Testing Strategy

### Unit Tests
- Orientation detection logic
- Conditional style application
- TeamWinsTally with isLandscape prop
- Custom hook if created

### Integration Tests
- Full game flow in landscape mode
- Full game flow in portrait mode
- Orientation change handling
- State persistence across orientation changes

### Component Tests
- GameScreen with mocked dimensions
- TeamWinsTally in both modes
- TallyControls (should be unaffected)
- All existing component tests

### Manual Testing
- Physical device rotation testing
- Test on multiple device sizes:
  - Small phone (iPhone SE)
  - Large phone (iPhone 14 Pro Max)
  - Tablet (iPad)
- Test on both iOS and Android
- Test web browser window resize

## Implementation Steps

### Step 1: Create Custom Hook (Optional)
```typescript
// src/hooks/useOrientation.ts
export const useOrientation = () => {
  const dimensions = useWindowDimensions();
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
};
```

### Step 2: Update TeamWinsTally Interface
```typescript
interface TeamWinsTallyProps {
  teamId: 'team1' | 'team2';
  wins: number;
  isLandscape?: boolean;
}
```

### Step 3: Create Orientation Tests (RED)
- Create orientation test files
- Run tests - should fail

### Step 4: Implement Orientation Support (GREEN)
- Add useWindowDimensions to GameScreen
- Pass isLandscape prop to TeamWinsTally
- Add conditional styles to TeamWinsTally
- Adjust teamSide layout

### Step 5: Run Tests
```bash
npm test
npm run lint
npm run typecheck
```

### Step 6: Manual Device Testing
- Test on physical devices
- Verify smooth transitions
- Check for layout issues

### Step 7: Refactor and Polish
- Extract constants
- Optimize performance
- Add documentation

## Constants and Values

### Landscape Positioning
```typescript
const LANDSCAPE_TALLY_CONSTANTS = {
  LEFT_OFFSET: 10,    // Distance from left edge for Team 1
  RIGHT_OFFSET: 10,   // Distance from right edge for Team 2
  VERTICAL_CENTER: '50%',
  TRANSLATE_Y: -40,   // Half of tally container height for centering
};
```

### Orientation Breakpoint
```typescript
const isLandscape = width > height;
// Alternative with threshold for edge cases:
const isLandscape = width > height * 1.1; // 10% threshold
```

## Definition of Done

### Code Complete When:
- [ ] Orientation detection implemented
- [ ] TeamWinsTally accepts isLandscape prop
- [ ] Landscape positioning applied correctly
- [ ] Portrait mode unchanged from current behavior
- [ ] All automated tests pass (≥90% coverage)
- [ ] Zero ESLint warnings
- [ ] Zero TypeScript errors
- [ ] Smooth orientation transitions
- [ ] No layout overlaps in either mode
- [ ] All existing functionality preserved

### Testing Complete When:
- [ ] Unit tests for orientation detection
- [ ] Unit tests for TeamWinsTally in both modes
- [ ] Integration tests for orientation changes
- [ ] Tested on iOS device (landscape + portrait)
- [ ] Tested on Android device (landscape + portrait)
- [ ] Tested on tablet
- [ ] Tested on web browser with resize
- [ ] Edge cases handled (square screens, rapid changes)

### Documentation Complete When:
- [ ] Code comments explain orientation logic
- [ ] README updated if significant change
- [ ] Constants documented

## Acceptance Criteria

### Must Have
1. Games Won tallies positioned on left/right sides in landscape mode
2. Games Won tallies at bottom in portrait mode (current behavior)
3. Orientation detection works reliably
4. Layout updates when device rotates
5. All tests passing with ≥90% coverage
6. Zero linting errors
7. No functionality regressions
8. Smooth visual transitions

### Should Have
1. Custom `useOrientation` hook for reusability
2. Extracted positioning constants
3. Optimized re-renders
4. Edge case handling (square screens)

### Could Have
1. Animation during orientation change
2. Configurable positioning offsets
3. Orientation-specific optimizations

### Won't Have
1. Manual orientation toggle (auto-detect only)
2. Separate portrait/landscape components
3. Orientation locking

## Risk Assessment

### Technical Risks
1. **Risk**: Dimension detection unreliable on some platforms
   - **Mitigation**: Use React Native's official `useWindowDimensions` hook
   - **Contingency**: Add manual testing on all target platforms

2. **Risk**: Performance issues with frequent dimension updates
   - **Mitigation**: Use React Native's optimized hook (debounced)
   - **Contingency**: Add custom debouncing if needed

3. **Risk**: Absolute positioning causes overlaps
   - **Mitigation**: Calculate positions carefully, test all screen sizes
   - **Contingency**: Adjust z-index or positioning values

4. **Risk**: Breaking existing tests
   - **Mitigation**: Add isLandscape prop with default value (false)
   - **Contingency**: Update tests incrementally

### Layout Risks
1. **Risk**: Games Won not visible on small screens in landscape
   - **Mitigation**: Test on iPhone SE (smallest common device)
   - **Contingency**: Adjust positioning or font sizes

2. **Risk**: Text readability issues
   - **Mitigation**: Maintain current font sizes
   - **Contingency**: Add responsive font sizing if needed

## Edge Cases

### Square Screens
- When width ≈ height, default to portrait behavior
- Consider adding threshold: `width > height * 1.1`

### Rapid Orientation Changes
- React Native's `useWindowDimensions` handles debouncing
- Component should handle rapid updates gracefully

### Web Browser Resize
- Web version should respond to window resize events
- Test with browser DevTools device emulation

### Tablet Landscape
- Large tablets may need different positioning
- Test on iPad landscape mode

## Performance Considerations

### Optimization Strategies
1. Use `useMemo` for landscape style calculations if complex
2. Avoid inline style objects (they cause re-renders)
3. Extract conditional styles to variables
4. Use React.memo on TeamWinsTally if needed

### Benchmarks
- Orientation change should feel instant (<16ms to maintain 60fps)
- No dropped frames during transition
- Component re-render count should be minimal

## Browser/Platform Support

### Target Platforms
- ✅ iOS (Safari)
- ✅ Android (Chrome)
- ✅ Web browsers (modern evergreen)

### API Support
- `useWindowDimensions`: Supported in React Native 0.59+
- `Dimensions`: Fallback for older versions

## Migration Path

### Backward Compatibility
- Add `isLandscape` prop with default `false`
- Existing code works without changes
- Tests pass without modification if prop not provided

### Rollout Strategy
1. Implement orientation detection
2. Add isLandscape prop to TeamWinsTally
3. Test thoroughly in both modes
4. Deploy to production
5. Monitor for issues

## Success Metrics

### Quantitative
- 100% test pass rate
- ≥90% code coverage maintained
- 0 ESLint warnings
- 0 TypeScript errors
- <16ms orientation change response time

### Qualitative
- Layout feels natural in both orientations
- No user confusion about control locations
- Better space utilization in landscape
- Smooth, professional transitions

## Follow-up Tasks (Future)

- Add animation during orientation transitions
- Consider orientation-aware font sizing
- Explore landscape-specific optimizations
- Add user preference to force orientation behavior
