# Portrait Mode Layout Fix Specification

## Overview
Fix portrait mode layout to ensure red and blue sections each occupy exactly 50% of the screen height, with floating score cards contained within their respective color zones. Cards must be fully responsive and scale properly across all screen sizes without crossing the 50% midline boundary.

## Problem Statement
Currently in portrait mode:
- The blue card (bottom-right) is crossing into the red area (top half)
- Cards use fixed percentage positioning that doesn't account for card height
- Components are not fully dynamic and may break on different screen sizes
- The 50/50 red/blue split background exists, but cards don't respect this boundary

## Requirements

### Functional Requirements
1. **FR1**: Red section must occupy exactly the top 50% of screen height
2. **FR2**: Blue section must occupy exactly the bottom 50% of screen height
3. **FR3**: Red team's floating card must be fully contained within the top 50% (red zone)
4. **FR4**: Blue team's floating card must be fully contained within the bottom 50% (blue zone)
5. **FR5**: Reset button positioned at exact 50% midline remains unchanged
6. **FR6**: Tally badge at top remains unchanged
7. **FR7**: All components must scale responsively for different screen sizes (phones, tablets)
8. **FR8**: Cards must maintain readability and usability on small screens
9. **FR9**: Cards must not overlap with reset button or tally badge

### Non-Functional Requirements
1. **NFR1**: Maintain current visual design aesthetic (floating cards, shadows, rounded corners)
2. **NFR2**: Preserve all existing functionality (scoring, game wins tracking)
3. **NFR3**: Ensure 60fps performance on standard devices
4. **NFR4**: Maintain accessibility standards for touch targets
5. **NFR5**: Code must be maintainable with clear separation of concerns

## Current Implementation Analysis

### Current Card Positioning
```typescript
// FloatingScoreCard.tsx
cardTopLeft: {
  top: '5%',      // Fixed percentage - doesn't account for card height
  left: '7.5%',
}
cardBottomRight: {
  bottom: '5%',   // Fixed percentage - doesn't account for card height
  right: '7.5%',
}
```

### Issues Identified
1. Cards positioned from edges without boundary constraints
2. No dynamic height calculation based on screen size
3. Large card content (240px score text) can exceed zone boundaries
4. No safeguards to prevent cross-zone overflow

## Solution Design

### Architecture Changes

#### 1. Dynamic Container Approach
Use flexbox containers for each team's zone with proper bounds checking:

```typescript
// GameScreen Portrait Layout
<View style={styles.portraitContainer}>
  {/* Red Zone - Top Half */}
  <View style={styles.redZone}>
    <FloatingScoreCard
      position="top-zone"
      maxHeight="90%" // Stay within zone bounds
      {...team1Props}
    />
  </View>

  {/* Blue Zone - Bottom Half */}
  <View style={styles.blueZone}>
    <FloatingScoreCard
      position="bottom-zone"
      maxHeight="90%" // Stay within zone bounds
      {...team2Props}
    />
  </View>

  {/* Centered overlays */}
  <ResetButton />
  <TallyBadge />
</View>
```

#### 2. Responsive Card Sizing
Cards should:
- Use `maxHeight` constraints relative to their zone
- Scale font sizes based on available space
- Maintain aspect ratio and readability

#### 3. Safe Positioning
Calculate safe positioning that ensures cards stay within bounds:
- Top card: positioned within top 50% minus margins
- Bottom card: positioned within bottom 50% minus margins
- Account for card height when positioning

### Implementation Approach

#### Option A: Percentage-Based with Constraints (Recommended)
- Keep floating card approach
- Add `maxHeight` constraints to cards
- Calculate safe positioning dynamically
- Use `Dimensions` API for screen-aware sizing

#### Option B: Flexbox Containers
- Wrap each card in a flex container representing the zone
- Use `flex: 1` for 50/50 split
- Position cards within containers using flexbox alignment

**Recommendation**: Option A - maintains floating aesthetic while adding safety constraints

## Test-Driven Development Plan

### Phase 1: Red Phase - Write Failing Tests

#### Test Suite 1: Zone Boundary Tests
```typescript
describe('Portrait Mode Zone Boundaries', () => {
  test('red zone should occupy exactly top 50% of screen', () => {
    const { getByTestId } = render(<GameScreen />);
    const redZone = getByTestId('red-zone');
    // Assert height is 50% of viewport
  });

  test('blue zone should occupy exactly bottom 50% of screen', () => {
    const { getByTestId } = render(<GameScreen />);
    const blueZone = getByTestId('blue-zone');
    // Assert height is 50% of viewport
  });

  test('red card should not extend beyond 50% midline', () => {
    const { getByTestId } = render(<GameScreen />);
    const redCard = getByTestId('team1-card');
    const cardBottom = getCardBottomPosition(redCard);
    const screenHeight = Dimensions.get('window').height;
    expect(cardBottom).toBeLessThanOrEqual(screenHeight * 0.5);
  });

  test('blue card should not extend beyond 50% midline', () => {
    const { getByTestId } = render(<GameScreen />);
    const blueCard = getByTestId('team2-card');
    const cardTop = getCardTopPosition(blueCard);
    const screenHeight = Dimensions.get('window').height;
    expect(cardTop).toBeGreaterThanOrEqual(screenHeight * 0.5);
  });
});
```

#### Test Suite 2: Responsive Sizing Tests
```typescript
describe('Portrait Mode Responsive Sizing', () => {
  const testSizes = [
    { width: 375, height: 667, name: 'iPhone SE' },
    { width: 390, height: 844, name: 'iPhone 14' },
    { width: 768, height: 1024, name: 'iPad' },
    { width: 320, height: 568, name: 'Small Phone' },
  ];

  testSizes.forEach(({ width, height, name }) => {
    test(`cards should fit within zones on ${name}`, () => {
      mockDimensions(width, height);
      const { getByTestId } = render(<GameScreen />);

      const redCard = getByTestId('team1-card');
      const blueCard = getByTestId('team2-card');

      // Verify both cards fit in their respective halves
      expect(getCardBottomPosition(redCard)).toBeLessThanOrEqual(height * 0.5);
      expect(getCardTopPosition(blueCard)).toBeGreaterThanOrEqual(height * 0.5);
    });
  });

  test('cards should scale content on small screens', () => {
    mockDimensions(320, 568); // Small phone
    const { getByTestId } = render(<GameScreen />);

    const scoreText = getByTestId('team1-score');
    const fontSize = getFontSize(scoreText);

    // Font should scale down on small screens
    expect(fontSize).toBeLessThan(240);
  });
});
```

#### Test Suite 3: Component Layout Tests
```typescript
describe('Portrait Mode Component Layout', () => {
  test('reset button should remain at 50% midline', () => {
    const { getByTestId } = render(<GameScreen />);
    const resetButton = getByTestId('reset-button');
    const container = getByTestId('middle-controls-container');

    const screenHeight = Dimensions.get('window').height;
    const buttonCenter = getElementCenterY(container);

    expect(buttonCenter).toBeCloseTo(screenHeight * 0.5, 1);
  });

  test('tally badge should remain at top', () => {
    const { getByTestId } = render(<GameScreen />);
    const tallyContainer = getByTestId('top-controls-container');

    expect(tallyContainer.props.style.top).toBe(24);
  });

  test('cards should not overlap with reset button', () => {
    const { getByTestId } = render(<GameScreen />);
    const redCard = getByTestId('team1-card');
    const blueCard = getByTestId('team2-card');
    const resetButton = getByTestId('reset-button');

    // Verify no overlap
    expect(hasOverlap(redCard, resetButton)).toBe(false);
    expect(hasOverlap(blueCard, resetButton)).toBe(false);
  });
});
```

#### Test Suite 4: Visual Regression Tests
```typescript
describe('Portrait Mode Visual Design', () => {
  test('should maintain floating card aesthetic', () => {
    const { getByTestId } = render(<GameScreen />);
    const redCard = getByTestId('team1-card');

    expect(redCard).toHaveStyle({
      position: 'absolute',
      borderRadius: 20,
      shadowOpacity: expect.any(Number),
      elevation: expect.any(Number),
    });
  });

  test('should maintain 50/50 background split', () => {
    const { getByTestId } = render(<GameScreen />);

    const topBg = getByTestId('top-background');
    const bottomBg = getByTestId('bottom-background');

    expect(topBg).toHaveStyle({ height: '50%', backgroundColor: '#FF0000' });
    expect(bottomBg).toHaveStyle({ height: '50%', backgroundColor: '#0000FF' });
  });
});
```

### Phase 2: Green Phase - Implement Solution

#### Step 1: Update Zone Containers
```typescript
// GameScreen.tsx - Portrait section
const styles = StyleSheet.create({
  redZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden', // Prevent card overflow
  },
  blueZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden', // Prevent card overflow
  },
});
```

#### Step 2: Update FloatingScoreCard with Dynamic Sizing
```typescript
// FloatingScoreCard.tsx
interface FloatingScoreCardProps {
  // ... existing props
  maxZoneHeight?: number; // Pass zone height for bounds calculation
}

const FloatingScoreCard: React.FC<FloatingScoreCardProps> = ({
  // ... existing props
  maxZoneHeight,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const zoneHeight = maxZoneHeight || screenHeight * 0.5;

  // Calculate safe card height (leave margin for positioning)
  const maxCardHeight = zoneHeight * 0.85; // 85% of zone

  // Dynamic font size based on available space
  const scoreFontSize = Math.min(240, maxCardHeight * 0.6);

  const dynamicStyles = {
    scoreText: {
      fontSize: scoreFontSize,
      lineHeight: scoreFontSize,
    },
    card: {
      maxHeight: maxCardHeight,
    },
  };

  return (
    <View style={[styles.card, cardStyle, dynamicStyles.card]}>
      {/* ... card content */}
    </View>
  );
};
```

#### Step 3: Update Card Positioning
```typescript
// Calculate safe positioning within zones
const calculateSafeCardPosition = (
  position: 'top-left' | 'bottom-right',
  screenDimensions: { width: number; height: number }
) => {
  const zoneHeight = screenDimensions.height * 0.5;
  const cardMaxHeight = zoneHeight * 0.85;

  if (position === 'top-left') {
    // Center in top zone
    return {
      top: (zoneHeight - cardMaxHeight) / 2,
      left: '7.5%',
    };
  } else {
    // Center in bottom zone
    return {
      bottom: (zoneHeight - cardMaxHeight) / 2,
      right: '7.5%',
    };
  }
};
```

#### Step 4: Add Test IDs for Zone Testing
```typescript
// GameScreen.tsx
<View testID="red-zone" style={styles.redZone}>
  <FloatingScoreCard
    testIdPrefix="team1"
    position="top-left"
    maxZoneHeight={screenHeight * 0.5}
    {...team1Props}
  />
</View>

<View testID="blue-zone" style={styles.blueZone}>
  <FloatingScoreCard
    testIdPrefix="team2"
    position="bottom-right"
    maxZoneHeight={screenHeight * 0.5}
    {...team2Props}
  />
</View>
```

### Phase 3: Refactor Phase

#### Refactoring Goals
1. Extract dimension calculations into reusable hooks
2. Create shared constants for margins and sizing
3. Improve type safety with strict TypeScript types
4. Add JSDoc documentation for layout calculations

#### Extract Layout Hook
```typescript
// hooks/usePortraitLayout.ts
export const usePortraitLayout = () => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const zoneHeight = height * 0.5;
  const maxCardHeight = zoneHeight * 0.85;
  const safeFontSize = Math.min(240, maxCardHeight * 0.6);

  const getCardPosition = (position: 'top' | 'bottom') => {
    const verticalMargin = (zoneHeight - maxCardHeight) / 2;

    if (position === 'top') {
      return { top: verticalMargin, left: '7.5%' };
    }
    return { bottom: verticalMargin, right: '7.5%' };
  };

  return {
    isPortrait,
    zoneHeight,
    maxCardHeight,
    safeFontSize,
    getCardPosition,
  };
};
```

#### Layout Constants
```typescript
// constants/layout.ts
export const PORTRAIT_LAYOUT = {
  ZONE_SPLIT: 0.5,           // 50% split
  CARD_MAX_HEIGHT_RATIO: 0.85, // 85% of zone
  SCORE_FONT_RATIO: 0.6,     // 60% of card height
  HORIZONTAL_MARGIN: '7.5%',
  MIN_SAFE_FONT_SIZE: 120,
  MAX_SAFE_FONT_SIZE: 240,
  RESET_BUTTON_SIZE: 56,
  TALLY_TOP_MARGIN: 24,
} as const;
```

## Implementation Phases

### Phase 1: Foundation (Tests + Zone Structure)
**Duration**: 2-3 hours
1. Write all test suites (Red phase)
2. Add zone containers with testIDs
3. Run tests to confirm failures
4. Add `overflow: 'hidden'` to zones

### Phase 2: Dynamic Sizing (Green phase)
**Duration**: 3-4 hours
1. Implement dimension calculations
2. Add maxHeight constraints to cards
3. Implement dynamic font sizing
4. Update card positioning logic
5. Run tests until all pass

### Phase 3: Refinement (Refactor phase)
**Duration**: 2 hours
1. Extract layout hook
2. Create constants file
3. Add documentation
4. Optimize performance
5. Code review and cleanup

### Phase 4: Testing & Validation
**Duration**: 2 hours
1. Manual testing on various screen sizes
2. Visual regression testing
3. Performance profiling
4. Accessibility audit

## Testing Strategy

### Unit Tests
- Zone dimension calculations
- Font size scaling logic
- Position calculation functions
- Boundary constraint checks

### Integration Tests
- Full portrait layout rendering
- Card positioning within zones
- Component interaction (scoring, reset)
- Orientation change handling

### Visual Tests
- Screenshot comparison tests
- Multiple device sizes
- Overflow detection
- Component alignment

### Manual Testing Checklist
- [ ] iPhone SE (375x667) - smallest common phone
- [ ] iPhone 14 (390x844) - standard phone
- [ ] iPhone 14 Pro Max (430x932) - large phone
- [ ] iPad Mini (768x1024) - small tablet
- [ ] iPad Pro (1024x1366) - large tablet
- [ ] Cards stay in respective zones on all sizes
- [ ] Text remains readable on smallest screen
- [ ] No overlap with reset button or tally badge
- [ ] Smooth animations and transitions
- [ ] Touch targets remain accessible

## Definition of Done

### Code Complete
- [ ] All tests written and passing
- [ ] Code reviewed and approved
- [ ] TypeScript types fully defined
- [ ] No console warnings or errors
- [ ] Performance benchmarks met

### Visual Design
- [ ] Cards fully contained in zones on all screen sizes
- [ ] 50/50 red/blue split maintained
- [ ] Floating aesthetic preserved
- [ ] Shadows and elevation correct
- [ ] Text scales appropriately

### Functionality
- [ ] All scoring functions work correctly
- [ ] Game wins tracking works correctly
- [ ] Reset button functions correctly
- [ ] No regressions in landscape mode
- [ ] Orientation changes handled smoothly

### Documentation
- [ ] Code comments for complex calculations
- [ ] JSDoc for public functions
- [ ] README updated with layout notes
- [ ] Spec document archived

## Acceptance Criteria

1. **AC1**: When rendered in portrait mode, the screen is divided into exactly 50% red (top) and 50% blue (bottom)
2. **AC2**: The red team's score card is fully visible and contained within the red zone on all screen sizes
3. **AC3**: The blue team's score card is fully visible and contained within the blue zone on all screen sizes
4. **AC4**: Cards do not overlap the center reset button or top tally badge
5. **AC5**: Score text remains readable (not truncated) on screens as small as 320x568
6. **AC6**: All tests pass with 100% coverage for layout logic
7. **AC7**: No visual regressions in landscape mode
8. **AC8**: Performance remains at 60fps during interactions

## Risk Mitigation

### Risk 1: Font Size Too Small on Small Screens
**Mitigation**: Set minimum font size threshold, switch to compact layout if needed

### Risk 2: Card Overlap with Reset Button
**Mitigation**: Add explicit overlap detection, adjust card max height if needed

### Risk 3: Performance Impact of Dynamic Calculations
**Mitigation**: Memoize calculations, use React.memo for card components

### Risk 4: Landscape Mode Regression
**Mitigation**: Comprehensive test coverage, separate layout logic clearly

## Success Metrics

- Zero overlap violations across all tested screen sizes
- 100% test coverage for new layout code
- No increase in render time (< 16ms for 60fps)
- Zero accessibility violations
- Positive user feedback on visual clarity

## Notes

- The background split already works correctly (50/50)
- The issue is specifically with floating card positioning
- Maintain the current floating card aesthetic
- Don't change reset button or tally badge positioning
- Focus on making cards responsive and zone-aware
