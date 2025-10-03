# Games Won Controls - Top Position with Arrow-Only Buttons

## Overview
Relocate the games won increment/decrement controls from their current bottom position to the top of each team's side, using minimalist arrow-only buttons (no text labels) positioned on either side of the tally badge.

## Problem Statement
Currently, the games won controls are positioned at the bottom of each team side with button text ("+"/"-"). The new design requires:
- Controls moved to the top next to the tally badge
- Arrow-only buttons (↑/↓) with no text
- Compact layout that doesn't interfere with the centered tally badge

## Requirements

### Functional Requirements

1. **FR1**: Games won increment button must be a small up arrow (↑) positioned on the right side of the tally badge
2. **FR2**: Games won decrement button must be a small down arrow (↓) positioned on the left side of the tally badge
3. **FR3**: Buttons must have no text labels, only arrow symbols
4. **FR4**: Left arrow decrements the corresponding team's games won count
5. **FR5**: Right arrow increments the corresponding team's games won count
6. **FR6**: Layout must work in both portrait and landscape orientations
7. **FR7**: Tally badge must remain centered between the arrow buttons
8. **FR8**: Arrow buttons must be small and unobtrusive
9. **FR9**: Touch targets must still meet minimum accessibility size (44x44px)
10. **FR10**: Remove the existing bottom games won controls entirely

### Non-Functional Requirements

1. **NFR1**: Arrow buttons must be visually consistent with the minimalist design
2. **NFR2**: Button press feedback must be immediate (< 100ms)
3. **NFR3**: Accessible to screen readers with proper labels
4. **NFR4**: No layout shift when toggling between portrait/landscape
5. **NFR5**: Maintain 100% test coverage

## Current Implementation Analysis

### Portrait Mode (`GameScreen.tsx:146-152`)
```typescript
<View testID="top-controls-container" style={styles.portraitTopControls}>
  <View testID="portrait-tally-badge" style={styles.portraitTallyBadge}>
    <Text style={styles.portraitTallyText}>
      {gameWins.team1} - {gameWins.team2}
    </Text>
  </View>
</View>
```

### Landscape Mode (`GameScreen.tsx:264-270`)
```typescript
<View testID="top-controls-container" style={styles.topControls}>
  <View testID="landscape-tally-badge" style={styles.landscapeTallyBadge}>
    <Text style={styles.landscapeTallyText}>
      {gameWins.team1} - {gameWins.team2}
    </Text>
  </View>
</View>
```

### Current Bottom Controls (to be removed)
- Portrait: `GameScreen.tsx:71-96` (team1), `GameScreen.tsx:117-142` (team2)
- Landscape: `GameScreen.tsx:189-214` (team1), `GameScreen.tsx:235-260` (team2)

## TDD Implementation Plan

### Phase 1: Portrait Mode - Left Arrow (Team 1 Decrement)

#### Test 1.1: RED - Left arrow button should exist
```typescript
// __tests__/GameScreen.gamesWonTopArrows.test.tsx
describe('Games Won Top Arrow Controls - Portrait', () => {
  test('should render left down arrow for team 1 decrement', () => {
    const { getByTestId } = render(<GameScreen />);

    const leftArrow = getByTestId('team1-wins-down-arrow');
    expect(leftArrow).toBeTruthy();
  });
});
```

**GREEN:** Add left arrow button in `GameScreen.tsx`
```typescript
<View testID="top-controls-container" style={styles.portraitTopControls}>
  <TouchableOpacity
    testID="team1-wins-down-arrow"
    accessibilityLabel="Decrement team 1 games won"
    onPress={handleDecrementTeam1Wins}
    style={styles.portraitTopArrowButton}
  >
    <Text style={styles.portraitTopArrowText}>↓</Text>
  </TouchableOpacity>

  <View testID="portrait-tally-badge" style={styles.portraitTallyBadge}>
    <Text style={styles.portraitTallyText}>
      {gameWins.team1} - {gameWins.team2}
    </Text>
  </View>
</View>
```

**REFACTOR:** Extract arrow component if needed

#### Test 1.2: RED - Left arrow should decrement team 1
```typescript
test('left down arrow should decrement team 1 games won', () => {
  const { getByTestId } = render(<GameScreen />);
  const team1WinsIncrement = getByTestId('team1-wins-increment'); // existing
  const leftArrow = getByTestId('team1-wins-down-arrow');

  // Increment to 1
  fireEvent.press(team1WinsIncrement);
  expect(getByTestId('tally-badge-text').props.children).toContain('1');

  // Decrement back to 0
  fireEvent.press(leftArrow);
  expect(getByTestId('tally-badge-text').props.children).toContain('0');
});
```

**GREEN:** Wire up `handleDecrementTeam1Wins` (already exists)

**REFACTOR:** Verify no duplicate functionality

#### Test 1.3: RED - Right arrow button should exist
```typescript
test('should render right up arrow for team 1 increment', () => {
  const { getByTestId } = render(<GameScreen />);

  const rightArrow = getByTestId('team1-wins-up-arrow');
  expect(rightArrow).toBeTruthy();
});
```

**GREEN:** Add right arrow button
```typescript
<View testID="top-controls-container" style={styles.portraitTopControls}>
  <TouchableOpacity
    testID="team1-wins-down-arrow"
    accessibilityLabel="Decrement team 1 games won"
    onPress={handleDecrementTeam1Wins}
    style={styles.portraitTopArrowButton}
  >
    <Text style={styles.portraitTopArrowText}>↓</Text>
  </TouchableOpacity>

  <View testID="portrait-tally-badge" style={styles.portraitTallyBadge}>
    <Text style={styles.portraitTallyText}>
      {gameWins.team1} - {gameWins.team2}
    </Text>
  </View>

  <TouchableOpacity
    testID="team1-wins-up-arrow"
    accessibilityLabel="Increment team 1 games won"
    onPress={handleIncrementTeam1Wins}
    style={styles.portraitTopArrowButton}
  >
    <Text style={styles.portraitTopArrowText}>↑</Text>
  </TouchableOpacity>
</View>
```

#### Test 1.4: RED - Right arrow should increment team 1
```typescript
test('right up arrow should increment team 1 games won', () => {
  const { getByTestId } = render(<GameScreen />);
  const rightArrow = getByTestId('team1-wins-up-arrow');

  fireEvent.press(rightArrow);
  expect(getByTestId('tally-badge-text').props.children).toContain('1');
});
```

**GREEN:** Verify handler is wired correctly

#### Test 1.5: RED - Arrow buttons should have no text, only symbols
```typescript
test('arrow buttons should contain only arrow symbols', () => {
  const { getByTestId } = render(<GameScreen />);

  const leftArrow = getByTestId('team1-wins-down-arrow');
  const rightArrow = getByTestId('team1-wins-up-arrow');

  // Should only contain arrow unicode characters
  const leftText = leftArrow.props.children.props.children;
  const rightText = rightArrow.props.children.props.children;

  expect(leftText).toBe('↓');
  expect(rightText).toBe('↑');
});
```

**GREEN:** Already implemented with arrow symbols

#### Test 1.6: RED - Layout should be horizontally centered
```typescript
test('controls should be centered horizontally', () => {
  const { getByTestId } = render(<GameScreen />);
  const container = getByTestId('top-controls-container');

  const styles = container.props.style;
  expect(styles).toMatchObject({
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  });
});
```

**GREEN:** Update `portraitTopControls` style
```typescript
portraitTopControls: {
  position: 'absolute',
  top: 24,
  left: 0,
  right: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}
```

#### Test 1.7: RED - Arrow buttons should be appropriately sized
```typescript
test('arrow buttons should be small and compact', () => {
  const { getByTestId } = render(<GameScreen />);
  const leftArrow = getByTestId('team1-wins-down-arrow');

  const style = leftArrow.props.style;
  expect(style.width).toBeLessThanOrEqual(44);
  expect(style.height).toBeLessThanOrEqual(44);
  expect(style.width).toBeGreaterThanOrEqual(32); // Touch target minimum
  expect(style.height).toBeGreaterThanOrEqual(32);
});
```

**GREEN:** Add arrow button styles
```typescript
portraitTopArrowButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 8,
},
portraitTopArrowText: {
  fontSize: 20,
  color: '#FFFFFF',
  fontWeight: '700',
},
```

### Phase 2: Remove Old Bottom Controls

#### Test 2.1: RED - Bottom games won controls should not exist in portrait
```typescript
test('should not render bottom games won controls in portrait', () => {
  const { queryByText } = render(<GameScreen />);

  // Old "GAMES WON" labels should not exist
  expect(queryByText('GAMES WON')).toBeNull();
});
```

**GREEN:** Remove bottom games won sections from portrait team sides

#### Test 2.2: RED - Old testIDs should not exist
```typescript
test('old games won testIDs should not be present', () => {
  const { queryByTestId } = render(<GameScreen />);

  // These were the old inline controls at the bottom
  expect(queryByTestId('team1-wins-increment')).toBeNull();
  expect(queryByTestId('team1-wins-decrement')).toBeNull();
  expect(queryByTestId('team2-wins-increment')).toBeNull();
  expect(queryByTestId('team2-wins-decrement')).toBeNull();
});
```

**GREEN:** Remove old controls JSX and related styles

### Phase 3: Landscape Mode Implementation

#### Test 3.1: RED - Landscape should have top arrow controls
```typescript
test('landscape mode should render top arrow controls', () => {
  mockWindowDimensions(667, 375); // Landscape

  const { getByTestId } = render(<GameScreen />);

  expect(getByTestId('team1-wins-down-arrow')).toBeTruthy();
  expect(getByTestId('team1-wins-up-arrow')).toBeTruthy();
});
```

**GREEN:** Add same arrow structure to landscape mode
```typescript
<View testID="top-controls-container" style={styles.topControls}>
  <TouchableOpacity
    testID="team1-wins-down-arrow"
    accessibilityLabel="Decrement team 1 games won"
    onPress={handleDecrementTeam1Wins}
    style={styles.landscapeTopArrowButton}
  >
    <Text style={styles.landscapeTopArrowText}>↓</Text>
  </TouchableOpacity>

  <View testID="landscape-tally-badge" style={styles.landscapeTallyBadge}>
    <Text style={styles.landscapeTallyText}>
      {gameWins.team1} - {gameWins.team2}
    </Text>
  </View>

  <TouchableOpacity
    testID="team1-wins-up-arrow"
    accessibilityLabel="Increment team 1 games won"
    onPress={handleIncrementTeam1Wins}
    style={styles.landscapeTopArrowButton}
  >
    <Text style={styles.landscapeTopArrowText}>↑</Text>
  </TouchableOpacity>
</View>
```

#### Test 3.2: RED - Landscape arrows should function correctly
```typescript
test('landscape arrow buttons should increment/decrement', () => {
  mockWindowDimensions(667, 375);

  const { getByTestId } = render(<GameScreen />);

  fireEvent.press(getByTestId('team1-wins-up-arrow'));
  expect(getByTestId('tally-badge-text').props.children).toContain('1');

  fireEvent.press(getByTestId('team1-wins-down-arrow'));
  expect(getByTestId('tally-badge-text').props.children).toContain('0');
});
```

**GREEN:** Verify handlers work in landscape

#### Test 3.3: RED - Landscape should not have old bottom controls
```typescript
test('landscape should not render old bottom controls', () => {
  mockWindowDimensions(667, 375);

  const { queryByText } = render(<GameScreen />);
  expect(queryByText('GAMES WON')).toBeNull();
});
```

**GREEN:** Remove landscape bottom games won sections

### Phase 4: Accessibility

#### Test 4.1: RED - Buttons should have accessibility labels
```typescript
test('arrow buttons should have descriptive accessibility labels', () => {
  const { getByLabelText } = render(<GameScreen />);

  expect(getByLabelText('Decrement team 1 games won')).toBeTruthy();
  expect(getByLabelText('Increment team 1 games won')).toBeTruthy();
});
```

**GREEN:** Already added in Phase 1

#### Test 4.2: RED - Touch targets meet minimum size
```typescript
test('arrow buttons should meet WCAG touch target minimum', () => {
  const { getByTestId } = render(<GameScreen />);
  const button = getByTestId('team1-wins-down-arrow');

  const style = button.props.style;
  expect(style.width).toBeGreaterThanOrEqual(44);
  expect(style.height).toBeGreaterThanOrEqual(44);
});
```

**GREEN:** Update button size to 44x44
```typescript
portraitTopArrowButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  // ... rest
},
```

### Phase 5: Visual Consistency

#### Test 5.1: RED - Snapshot test for new layout
```typescript
test('portrait layout snapshot with top arrow controls', () => {
  const tree = renderer.create(<GameScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

**GREEN:** Generate new snapshot

#### Test 5.2: RED - Tally badge should remain centered
```typescript
test('tally badge should be centered between arrows', () => {
  const { getByTestId } = render(<GameScreen />);
  const container = getByTestId('top-controls-container');

  expect(container.props.style.justifyContent).toBe('center');
  expect(container.props.style.alignItems).toBe('center');
});
```

**GREEN:** Already implemented

### Phase 6: Update Existing Tests

#### Test 6.1: Update tests that reference old testIDs
```typescript
// Find all tests using old testIDs and update them
// Old: team1-wins-increment, team1-wins-decrement
// New: team1-wins-up-arrow, team1-wins-down-arrow
```

**GREEN:** Update all affected test files

#### Test 6.2: Remove tests for removed components
```typescript
// Delete tests that specifically tested bottom games won layout
// Keep integration tests that verify increment/decrement functionality
```

**GREEN:** Clean up obsolete tests

## Architecture Changes

### Files Modified
1. **`src/components/GameScreen.tsx`**
   - Add arrow buttons to top controls container (both portrait/landscape)
   - Remove bottom games won sections
   - Update handler references

2. **`src/components/GameScreen.tsx` (styles)**
   - Add: `portraitTopArrowButton`, `portraitTopArrowText`
   - Add: `landscapeTopArrowButton`, `landscapeTopArrowText`
   - Update: `portraitTopControls`, `topControls` (flexDirection: 'row')
   - Remove: `portraitGamesSection`, `portraitGamesControls`, `portraitGamesText`, `portraitSmallButton`, `portraitSmallButtonText`, `portraitGamesLabel`
   - Remove: `landscapeGamesSection`, `landscapeGamesControls`, `landscapeGamesText`, `landscapeSmallButton`, `landscapeSmallButtonText`, `landscapeGamesLabel`

### Files Updated (Tests)
1. **`__tests__/GameScreen.gamesWonTopArrows.test.tsx`** - NEW
2. **`__tests__/GameScreen.test.tsx`** - Update testID references
3. **`__tests__/GameWinsIntegration.test.tsx`** - Update testID references
4. **`__tests__/TeamWinsTally.inline.test.tsx`** - May need updates or deletion
5. **`__tests__/TeamWinsTally.inline.accessibility.test.tsx`** - Update
6. **`__tests__/GameScreen.portrait.test.tsx`** - Update snapshots

## Test Categories

### Unit Tests
- ✅ Arrow button rendering (portrait/landscape)
- ✅ Arrow button functionality (increment/decrement)
- ✅ Arrow symbols only (no text)
- ✅ Layout centering
- ✅ Button sizing
- ✅ Accessibility labels

### Integration Tests
- ✅ Full increment/decrement flow with new buttons
- ✅ Orientation switching maintains arrow controls
- ✅ State updates reflect in tally badge

### Regression Tests
- ✅ Old bottom controls removed
- ✅ No duplicate functionality
- ✅ All existing game logic still works

## Definition of Done

- [ ] All TDD tests passing (234+ tests)
- [ ] New arrow buttons render at top in both orientations
- [ ] Arrows increment/decrement games won correctly
- [ ] No text labels, only arrow symbols (↑/↓)
- [ ] Old bottom games won controls completely removed
- [ ] Touch targets meet 44x44px minimum
- [ ] Accessibility labels present
- [ ] Layout remains centered
- [ ] Test coverage ≥ 90% maintained
- [ ] TypeScript type checking passes
- [ ] ESLint passes with 0 warnings
- [ ] Snapshot tests updated

## Acceptance Criteria

1. **Visual**: Arrow buttons appear at top on either side of tally badge
2. **Visual**: Only arrow symbols visible, no "GAMES WON" text or +/- buttons
3. **Functional**: Left arrow (↓) decrements team 1 games won
4. **Functional**: Right arrow (↑) increments team 1 games won
5. **Functional**: Tally badge displays correctly between arrows
6. **Functional**: Works in both portrait and landscape modes
7. **Visual**: Old bottom controls no longer visible
8. **Accessibility**: Screen readers can identify button purposes
9. **Responsive**: Touch targets are easy to tap on mobile devices
10. **Consistent**: Design matches minimalist aesthetic from image

## Implementation Notes

### Arrow Symbols
Use Unicode arrow characters:
- Up arrow: `↑` (U+2191)
- Down arrow: `↓` (U+2193)

### Alternative Symbols (if needed)
- Up triangle: `▲` (U+25B2)
- Down triangle: `▼` (U+25BC)
- Chevron up: `⌃` (U+2303)
- Chevron down: `⌄` (U+2304)

### Style Considerations
- Arrows should be semi-transparent background: `rgba(0, 0, 0, 0.15)`
- Arrow text color: `#FFFFFF`
- Button size: 44x44px (accessibility minimum)
- Margin between buttons and badge: 8-12px
- Font weight: Bold (700)

### Layout Structure
```
[↓]  [TALLY BADGE]  [↑]
 |        |          |
Left   Center     Right
Dec              Inc
```

## Rollback Plan

If issues arise:
1. Revert `GameScreen.tsx` changes
2. Re-add bottom games won controls from git history
3. Restore old test files
4. Games won functionality will continue to work with old UI

## Future Enhancements

- Consider adding haptic feedback on button press
- Animate tally count changes
- Add visual press state (highlight/scale animation)
- Consider separate increment/decrement for team 2 if needed
