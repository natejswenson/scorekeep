# Layout Optimization for Landscape Mode - TDD Specification

## Overview
Optimize the ScoreKeep game interface for better landscape mode display on phones by:
1. Reducing vertical spacing between score circle and decrement button
2. Moving Games Won section higher on screen
3. Relocating tally controls (+/-) to top of screen between team sides
4. Preventing overlap between middle controls and team score circles

## Requirements

### Functional Requirements
1. **FR1**: Score circle and decrement button must be closer together (reduce gap)
2. **FR2**: Games Won tally section must move up to fit better in landscape viewport
3. **FR3**: Tally controls (+/- for game wins) must relocate to top center between team sides
4. **FR4**: Total Game Counter must remain visible with tally controls at top
5. **FR5**: Reset button must remain accessible in middle area (no overlap with score circles)
6. **FR6**: All touch targets must maintain minimum 44px size for accessibility
7. **FR7**: Layout must work in both portrait and landscape orientations
8. **FR8**: Component isolation must be maintained (scoring vs tally systems)

### Non-Functional Requirements
1. **NFR1**: All existing tests must continue to pass
2. **NFR2**: Test coverage must remain ≥90%
3. **NFR3**: Zero ESLint warnings
4. **NFR4**: Zero TypeScript errors
5. **NFR5**: Smooth visual appearance with no layout jumps
6. **NFR6**: Maintain accessibility standards (labels, roles, touch targets)

## Current Layout Analysis

### Current Structure
```
+-----------------------------------+
|  Team 1          |       Team 2   |
|  (Name)          |       (Name)   |
|                  |                |
|  ( Score )       |    ( Score )   |
|  ( Circle)       |    ( Circle)   |
|                  |                |
|     (-)          |       (-)      |
|                  |                |
|  Games Won       |   Games Won    |
|     [0]          |      [0]       |
+-----------------------------------+
|         [Tally Controls]          |
|         + Game # +                |
|         [Reset ↻]                 |
+-----------------------------------+
```

### Target Layout
```
+-----------------------------------+
|  Team 1  [+ Game1 +]  Team 2     |
|  (Name)                 (Name)    |
|                                   |
|  ( Score )       ( Score )        |
|  ( Circle)       ( Circle )       |
|     (-)             (-)           |
|                                   |
|  Games Won       Games Won        |
|     [0]             [0]           |
|                                   |
|         [Reset ↻]                 |
+-----------------------------------+
```

## TDD Implementation Plan

### Phase 1: Update Layout Styles (RED-GREEN-REFACTOR)

#### RED - Write Failing Tests

**Test File**: `__tests__/GameScreen.layout.test.tsx` (new file)

```typescript
describe('GameScreen Layout Optimization', () => {
  describe('Vertical Spacing', () => {
    test('should reduce gap between score circle and decrement button', () => {
      // Test that marginBottom on scoreArea is reduced from 40 to 10
    });

    test('should position Games Won section higher in viewport', () => {
      // Test that TeamWinsTally marginTop is reduced from 20 to 8
    });
  });

  describe('Tally Controls Position', () => {
    test('should position tally controls at top of screen', () => {
      // Test that middleControls top position is at 5-10% instead of 45%
    });

    test('should display tally controls above team names', () => {
      // Verify z-index or layout order ensures visibility
    });

    test('should center tally controls horizontally', () => {
      // Verify left: 50% and proper transform
    });
  });

  describe('Reset Button Position', () => {
    test('should position reset button in lower middle area', () => {
      // Test that reset button remains at ~45% vertical position
    });

    test('should not overlap with score circles', () => {
      // Calculate and verify positions ensure no overlap
    });
  });

  describe('Accessibility', () => {
    test('should maintain minimum 44px touch targets for all controls', () => {
      // Verify tally controls maintain minWidth/minHeight of 44px
    });

    test('should preserve accessibility labels', () => {
      // Verify all existing labels remain intact
    });
  });

  describe('Responsive Layout', () => {
    test('should work in landscape orientation', () => {
      // Mock landscape dimensions and verify layout
    });

    test('should work in portrait orientation', () => {
      // Mock portrait dimensions and verify layout
    });
  });
});
```

**Test File**: `__tests__/TallyControls.layout.test.tsx` (update existing)

```typescript
describe('TallyControls Layout Updates', () => {
  test('should render in horizontal layout at top of screen', () => {
    // Verify flexDirection: 'row' and proper positioning
  });

  test('should include Total Game Counter inline', () => {
    // Verify TotalGameCounter is integrated in horizontal layout
  });

  test('should maintain spacing between controls', () => {
    // Verify proper spacing between team1, counter, team2 controls
  });
});
```

**Test File**: `__tests__/GameWinsIntegration.test.tsx` (update existing)

```typescript
describe('Game Wins Integration - Layout', () => {
  test('should maintain tally independence with new layout', () => {
    // Verify tally operations work with new positioning
  });

  test('should not interfere with score operations', () => {
    // Verify score buttons remain accessible with new layout
  });
});
```

#### GREEN - Implement Minimal Code

**File**: `src/components/GameScreen.tsx`

Changes:
1. Reduce `scoreArea` marginBottom from 40 to 10
2. Update `middleControls` top position from 45% to ~8%
3. Update `middleControls` transform to account for new position
4. Add separate container for reset button positioned at 45%
5. Ensure z-index layering for proper visibility

**File**: `src/components/TallyControls.tsx`

Changes:
1. Update styles for top positioning context
2. Ensure horizontal layout works in constrained space
3. Adjust button sizes if needed while maintaining 44px minimum

**File**: `src/components/TeamWinsTally.tsx`

Changes:
1. Reduce marginTop from 20 to 8
2. Adjust any padding/spacing for tighter layout

#### REFACTOR - Optimize and Clean

1. Extract magic numbers to constants
2. Add comments explaining layout decisions
3. Ensure consistent spacing variables
4. Optimize style calculations

### Phase 2: Visual Polish (RED-GREEN-REFACTOR)

#### RED - Write Tests

```typescript
describe('Layout Visual Polish', () => {
  test('should maintain visual hierarchy', () => {
    // Verify proper spacing ratios between elements
  });

  test('should have smooth transitions', () => {
    // Verify no layout shift or jumps
  });

  test('should maintain color contrast', () => {
    // Verify all elements remain visible with new positioning
  });
});
```

#### GREEN - Implement

1. Fine-tune spacing values
2. Adjust font sizes if needed
3. Ensure proper shadow/elevation for layered elements

#### REFACTOR

1. Consolidate spacing constants
2. Document responsive breakpoints if added

### Phase 3: Cross-Device Testing (RED-GREEN-REFACTOR)

#### RED - Write Tests

```typescript
describe('Cross-Device Layout', () => {
  test('should work on small phones in landscape', () => {
    // Test with 667x375 (iPhone SE landscape)
  });

  test('should work on large phones in landscape', () => {
    // Test with 926x428 (iPhone 14 Pro Max landscape)
  });

  test('should work on tablets in landscape', () => {
    // Test with 1024x768 (iPad landscape)
  });
});
```

#### GREEN - Implement

1. Add percentage-based positioning where appropriate
2. Test on various viewports
3. Adjust if needed for edge cases

#### REFACTOR

1. Extract responsive helpers if needed
2. Document device-specific considerations

## Testing Strategy

### Unit Tests
- Individual component positioning
- Style calculations
- Spacing values
- Touch target sizes

### Integration Tests
- Component interaction with new layout
- Tally controls in new position
- Reset button accessibility
- No overlap scenarios

### Visual Regression Tests (Manual)
- Screenshot comparison before/after
- Test on physical devices:
  - iPhone in landscape
  - Android phone in landscape
  - Tablet in landscape

### Accessibility Tests
- Touch target sizes ≥44px
- Color contrast maintained
- Screen reader navigation order
- Keyboard navigation (web)

## Implementation Steps

### Step 1: Setup Test Infrastructure
```bash
# Ensure testing environment supports layout testing
npm install --save-dev @testing-library/react-native-layout
```

### Step 2: Create Test Files
1. Create `__tests__/GameScreen.layout.test.tsx`
2. Update `__tests__/TallyControls.test.tsx`
3. Update `__tests__/GameWinsIntegration.test.tsx`

### Step 3: Run Tests (RED Phase)
```bash
npm test
# All new tests should fail
```

### Step 4: Update Components (GREEN Phase)
1. Modify `src/components/GameScreen.tsx` styles
2. Modify `src/components/TallyControls.tsx` if needed
3. Modify `src/components/TeamWinsTally.tsx` if needed

### Step 5: Verify Tests Pass
```bash
npm test
npm run lint
npm run typecheck
```

### Step 6: Manual Testing
1. Test in Expo on physical device
2. Rotate to landscape mode
3. Verify no overlaps
4. Test all interactions

### Step 7: Refactor
1. Extract constants
2. Add documentation
3. Optimize performance if needed

## Definition of Done

### Code Complete When:
- [ ] All automated tests pass (100%)
- [ ] Test coverage remains ≥90%
- [ ] Zero ESLint warnings
- [ ] Zero TypeScript errors
- [ ] Tally controls positioned at top center
- [ ] Score circle and decrement button closer together
- [ ] Games Won section moved higher
- [ ] Reset button accessible without overlap
- [ ] All touch targets ≥44px
- [ ] Layout works in landscape mode
- [ ] Layout works in portrait mode
- [ ] Accessibility labels intact
- [ ] Component isolation maintained

### Documentation Complete When:
- [ ] Code comments explain layout decisions
- [ ] README updated with layout notes if significant
- [ ] Spacing constants documented

### Testing Complete When:
- [ ] Unit tests for all style changes
- [ ] Integration tests for layout interactions
- [ ] Manual testing on ≥2 physical devices
- [ ] Screenshot comparison verified
- [ ] Accessibility verified

## Acceptance Criteria

### Must Have
1. Tally controls (+/-) appear at top center between team sides
2. Total Game Counter visible with tally controls
3. Score circle and decrement button gap reduced by ≥50%
4. Games Won section positioned higher (marginTop reduced)
5. Reset button remains accessible in middle area
6. No overlap between any UI elements
7. All existing functionality preserved
8. All tests passing
9. Works in landscape mode on phones

### Should Have
1. Smooth visual appearance
2. Consistent spacing throughout
3. Optimal use of vertical space
4. Clear visual hierarchy

### Could Have
1. Dynamic layout adjustments based on screen size
2. Animation when rotating device
3. Optimized spacing for tablets

### Won't Have
1. Complete redesign of component structure
2. New features beyond layout changes
3. Changes to scoring logic

## Risk Assessment

### Technical Risks
1. **Risk**: Overlap on small screens
   - **Mitigation**: Test on iPhone SE (smallest common device)
   - **Contingency**: Add responsive breakpoints

2. **Risk**: Breaking existing tests
   - **Mitigation**: Update tests incrementally
   - **Contingency**: Revert changes and re-approach

3. **Risk**: Accessibility violations
   - **Mitigation**: Maintain 44px touch targets throughout
   - **Contingency**: Adjust spacing to accommodate

### Layout Risks
1. **Risk**: Tally controls too crowded at top
   - **Mitigation**: Use horizontal layout with adequate spacing
   - **Contingency**: Reduce font sizes slightly or adjust positions

2. **Risk**: Reset button in awkward position
   - **Mitigation**: Center it in remaining vertical space
   - **Contingency**: Move to bottom or alternative location

## Implementation Constants

### Proposed Style Values

```typescript
// Current vs Proposed spacing values
const SPACING = {
  scoreArea: {
    marginBottom: {
      current: 40,
      proposed: 10  // Reduced by 30px
    }
  },
  teamWinsTally: {
    marginTop: {
      current: 20,
      proposed: 8  // Reduced by 12px
    }
  },
  middleControls: {
    top: {
      current: '45%',
      proposed: '8%'  // Moved to top
    }
  },
  resetButton: {
    top: {
      current: '45%',  // Stays at 45%
      proposed: '45%'
    }
  }
};
```

## Test Execution Plan

### Phase 1: Layout Tests
```bash
npm test -- GameScreen.layout.test.tsx
# Expected: FAIL (RED phase)
```

### Phase 2: Implementation
```bash
# Make code changes
npm test
# Expected: PASS (GREEN phase)
```

### Phase 3: Integration
```bash
npm test -- GameWinsIntegration.test.tsx
# Expected: PASS (all existing tests)
```

### Phase 4: Full Suite
```bash
npm test
npm run lint
npm run typecheck
# Expected: All PASS, 0 warnings, 0 errors
```

### Phase 5: Manual Testing
1. Start Expo: `npm start`
2. Open on physical device
3. Rotate to landscape
4. Verify layout improvements
5. Test all interactions

## Success Metrics

### Quantitative
- 100% test pass rate
- ≥90% code coverage maintained
- 0 ESLint warnings
- 0 TypeScript errors
- 44px minimum touch targets (measured)
- <5% overlap tolerance (calculated from layout)

### Qualitative
- Visual inspection: layout appears balanced
- User testing: no confusion about control locations
- Device testing: works on 100% of tested devices
- Accessibility: all controls easily reachable

## Rollback Plan

If implementation fails or introduces regressions:

1. Revert commits:
   ```bash
   git revert HEAD~N  # N = number of commits
   ```

2. Restore from backup:
   ```bash
   git checkout main -- src/components/GameScreen.tsx
   git checkout main -- src/components/TallyControls.tsx
   ```

3. Re-run tests to confirm stability:
   ```bash
   npm test
   ```

## Notes

- Maintain TDD discipline: RED → GREEN → REFACTOR
- Test on real devices, not just simulators
- Consider various phone aspect ratios (18:9, 19.5:9, etc.)
- Preserve all existing functionality and tests
- Document any layout trade-offs in code comments
