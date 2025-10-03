# Games Won Inline Controls Specification

## Feature Description
Redesign the games won controls to display increment/decrement buttons inline with the value, with the entire control group width constrained to match the "Games Won" label width above it, in both portrait and landscape orientations.

## Requirements

### Functional Requirements
1. Games won increment (+) and decrement (-) buttons must be displayed inline with the games won value
2. Layout pattern: `(- icon) {games won value} (+ icon)`
3. The total width of the three-element control group must not exceed the width of the "Games Won" text label displayed above
4. Layout constraint must be maintained in both portrait and landscape device orientations
5. All controls must remain accessible and tappable with appropriate touch target sizes
6. The games won value must remain centered between the increment/decrement buttons

### Non-Functional Requirements
1. Maintain minimum touch target sizes for mobile usability (44x44 points minimum)
2. Preserve visual consistency with existing team tally design
3. Ensure controls are visually balanced and aesthetically pleasing
4. Support responsive layout that adapts to different screen sizes
5. Maintain high contrast for visibility in various lighting conditions

## TDD Plan

### Red-Green-Refactor Cycle

#### Phase 1: Layout Structure Tests
**Red:**
- Write tests verifying inline layout structure (row direction)
- Write tests verifying all three elements are rendered (decrement, value, increment)
- Write tests verifying the control group width constraint relative to label

**Green:**
- Implement inline flex layout with row direction
- Render all three controls in correct order
- Add width constraint logic

**Refactor:**
- Extract layout constants
- Optimize flex properties for consistency

#### Phase 2: Responsive Behavior Tests
**Red:**
- Write tests verifying layout in landscape orientation
- Write tests verifying layout in portrait orientation
- Write tests verifying width constraint in both orientations

**Green:**
- Implement responsive width calculations
- Add orientation-aware sizing

**Refactor:**
- Create reusable responsive utility functions
- Consolidate orientation detection logic

#### Phase 3: Touch Target Tests
**Red:**
- Write tests verifying minimum touch target sizes
- Write tests verifying button accessibility
- Write tests verifying spacing between controls

**Green:**
- Implement minimum touch target sizes
- Add appropriate padding/hitSlop
- Implement spacing constraints

**Refactor:**
- Extract touch target size constants
- Optimize spacing calculations

#### Phase 4: Visual Alignment Tests
**Red:**
- Write tests verifying value centering between buttons
- Write tests verifying vertical alignment
- Write tests verifying alignment with label above

**Green:**
- Implement centering logic
- Add vertical alignment properties
- Align control group with label

**Refactor:**
- Simplify alignment code
- Extract alignment utilities

## Test Categories

### Unit Tests
- **Component Rendering**
  - Renders decrement button with correct icon
  - Renders games won value display
  - Renders increment button with correct icon
  - All elements rendered in correct order

- **Layout Properties**
  - Container uses row flex direction
  - Controls are horizontally aligned
  - Value is centered between buttons
  - Width constraint is applied

- **Button Interaction**
  - Decrement button triggers correct action
  - Increment button triggers correct action
  - Buttons have appropriate touch targets
  - Buttons have proper accessibility labels

### Integration Tests
- **Games Won Control Integration**
  - Control group integrates with existing tally display
  - Width matches "Games Won" label width
  - Updates reflect in game state correctly
  - Control group maintains alignment during state updates

- **Responsive Layout**
  - Layout adapts correctly in portrait mode
  - Layout adapts correctly in landscape mode
  - Width constraint maintained across orientations
  - Touch targets remain usable in all orientations

### Visual Regression Tests
- Snapshot tests for portrait orientation
- Snapshot tests for landscape orientation
- Snapshot tests with different games won values (0, 1, 10+)
- Snapshot tests for alignment with label

## Architecture Design

### Component Structure
```
TallyControls (existing component - to be modified)
├── Games Won Label (existing)
└── GamesWonInlineControls (new or refactored)
    ├── DecrementButton (-)
    ├── GamesWonValue
    └── IncrementButton (+)
```

### Style Architecture
```typescript
// Layout constants
const GAMES_WON_LABEL_WIDTH = measureText('Games Won', labelStyle)
const BUTTON_SIZE = 44 // Minimum touch target
const CONTROL_SPACING = 8 // Space between controls

// Styles
gamesWonInlineContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: GAMES_WON_LABEL_WIDTH,
  alignSelf: 'center'
}

gamesWonButton: {
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  justifyContent: 'center',
  alignItems: 'center'
}

gamesWonValue: {
  flex: 1,
  textAlign: 'center',
  marginHorizontal: CONTROL_SPACING
}
```

### State Management
- No changes to Redux state structure required
- Existing `gameWinIncrement`/`gameWinDecrement` actions remain unchanged
- Component receives `gamesWon` value from Redux state

## Implementation Phases

### Phase 1: Test Setup
1. Create test file for inline controls component
2. Set up test utilities for measuring dimensions
3. Create mock orientation detection utilities
4. Define test fixtures for different screen sizes

### Phase 2: Layout Implementation
1. Implement inline flex layout structure
2. Add width constraint based on label width
3. Implement responsive sizing logic
4. Add alignment properties

### Phase 3: Button Implementation
1. Implement decrement button with icon
2. Implement increment button with icon
3. Add touch target sizing
4. Add accessibility labels

### Phase 4: Integration
1. Integrate with existing TallyControls component
2. Connect to Redux actions
3. Test with existing game state
4. Verify in both orientations

### Phase 5: Polish
1. Fine-tune spacing and alignment
2. Verify touch targets meet minimum sizes
3. Test on multiple device sizes
4. Verify visual consistency

## Testing Strategy

### Test Data
- Games won values: 0, 1, 5, 10, 99, 100+
- Orientations: portrait, landscape
- Device sizes: small phone, large phone, tablet
- Team colors: red, blue (ensure contrast)

### Test Scenarios
1. **Initial Render**
   - Verify all controls render correctly
   - Verify width constraint is applied
   - Verify alignment with label

2. **User Interaction**
   - Tap decrement button decrements value
   - Tap increment button increments value
   - Cannot decrement below 0
   - Value updates are reflected immediately

3. **Responsive Behavior**
   - Rotate device from portrait to landscape
   - Rotate device from landscape to portrait
   - Width constraint maintained in both orientations
   - Touch targets remain usable

4. **Edge Cases**
   - Very large games won values (3+ digits)
   - Rapid tapping of increment/decrement
   - Simultaneous taps on both buttons (should not occur)

### Coverage Goals
- 90% code coverage (matching project threshold)
- 100% of user interaction paths tested
- All responsive breakpoints tested
- All edge cases covered

## Definition of Done

### Code Complete
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Visual regression tests passing
- [ ] Code coverage ≥ 90%
- [ ] TypeScript type checking passing
- [ ] ESLint passing with 0 warnings

### Functional Complete
- [ ] Games won controls display inline in portrait mode
- [ ] Games won controls display inline in landscape mode
- [ ] Control group width does not exceed label width
- [ ] Increment button increases games won value
- [ ] Decrement button decreases games won value
- [ ] Touch targets meet minimum size requirements
- [ ] Value is centered between buttons

### Quality Complete
- [ ] No visual regressions in existing features
- [ ] Accessible to screen readers
- [ ] Tested on iOS and Android
- [ ] Tested on multiple device sizes
- [ ] Performance remains optimal
- [ ] Code follows project conventions

## Acceptance Criteria

1. **Layout Structure**
   - The decrement button (-), games won value, and increment button (+) are displayed in a single horizontal row
   - The three controls are visually grouped together
   - The control group is horizontally centered below the "Games Won" label

2. **Width Constraint**
   - The total width of the control group (including all spacing) does not exceed the width of the "Games Won" text label
   - This constraint is maintained when device orientation changes to landscape
   - This constraint is maintained when device orientation changes to portrait

3. **Functionality**
   - Tapping the decrement button (-) decreases the games won value by 1
   - Tapping the increment button (+) increases the games won value by 1
   - The games won value cannot go below 0
   - Changes are immediately reflected in the UI and game state

4. **Usability**
   - Both buttons have minimum touch target sizes of 44x44 points
   - The games won value is clearly readable
   - There is sufficient spacing between controls to prevent accidental taps
   - The controls are visually balanced and aesthetically consistent with the app

5. **Responsiveness**
   - The layout works correctly on small phones (e.g., iPhone SE)
   - The layout works correctly on large phones (e.g., iPhone Pro Max)
   - The layout works correctly on tablets
   - The layout adapts smoothly when orientation changes

## Notes

### Design Considerations
- Consider using icon buttons (TouchableOpacity with icon) for +/- controls
- Value display should use same font/style as existing tally numbers
- May need to reduce button size slightly to fit within label width constraint
- Consider using `hitSlop` property to maintain touch targets if visual size is reduced

### Technical Considerations
- Use `onLayout` event to measure "Games Won" label width dynamically
- Consider using `Dimensions` API with event listener for orientation changes
- Ensure layout doesn't break with very large numbers (100+ games won)
- Test with different font sizes for accessibility

### Future Enhancements
- Consider adding haptic feedback on button press
- Consider adding animation when value changes
- Consider adding long-press for rapid increment/decrement
