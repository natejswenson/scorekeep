# Overlapped Decrement Button Specification

## Feature Description
Reposition the score decrement button to appear behind the main score circle, with the top 20% of the decrement button hidden behind the larger score circle. This creates a visual grouping that gives a cleaner, more minimalist appearance while ensuring the "-" symbol remains fully visible.

## Requirements

### Functional Requirements
1. The decrement button must be positioned behind (lower z-index) the main score circle
2. The top 20% of the decrement button must be visually hidden behind the score circle
3. The "-" text/symbol must remain fully visible and not covered by the score circle
4. The decrement button must remain fully functional (tappable)
5. The visual grouping must be maintained in both portrait and landscape orientations
6. Touch target size must remain at minimum 44x44 for accessibility

### Non-Functional Requirements
1. Clean, minimalist visual appearance
2. Maintain existing touch interaction functionality
3. Preserve accessibility for screen readers
4. No performance degradation
5. Consistent behavior across iOS, Android, and web platforms
6. Maintain 90% test coverage threshold

## Current State Analysis

### Current Layout
- **Score Circle**: 150px diameter, centered in team area
- **Decrement Button**: 60px diameter, positioned below score circle
- **Layout**: Vertically stacked with margin between elements
- **Z-index**: All elements on same layer

### Target Layout
- **Score Circle**: 150px diameter (unchanged)
- **Decrement Button**: 60px diameter, positioned with top 20% overlapped
- **Overlap**: Top 12px (20% of 60px) hidden behind score circle
- **Z-index**: Decrement button lower than score circle
- **Visual Effect**: Appears as grouped unit, cleaner appearance

## TDD Plan

### Red-Green-Refactor Cycle

#### Phase 1: Layout and Positioning Tests
**Red:**
- Write tests verifying decrement button has lower z-index than score circle
- Write tests verifying decrement button position overlaps score circle
- Write tests verifying overlap calculation (top 20% hidden)
- Tests should fail because buttons are currently separate

**Green:**
- Add z-index to score circle (higher value)
- Add z-index to decrement button (lower value)
- Adjust decrement button positioning to overlap
- Use negative top margin or absolute positioning

**Refactor:**
- Extract overlap percentage as constant
- Create reusable positioning calculations
- Optimize style definitions

#### Phase 2: Visual Verification Tests
**Red:**
- Write snapshot tests for visual grouping
- Write tests verifying "-" symbol visibility
- Write tests for both portrait and landscape modes
- Tests should verify layout structure

**Green:**
- Implement positioning that maintains "-" visibility
- Ensure overlap doesn't cover text
- Test in both orientations

**Refactor:**
- Simplify positioning logic
- Extract common calculations

#### Phase 3: Touch Target Tests
**Red:**
- Write tests verifying decrement button remains tappable
- Write tests for touch target size (minimum 44x44)
- Write tests for hitSlop if needed
- Tests should verify full functionality

**Green:**
- Ensure button remains interactive despite overlap
- Add hitSlop if visual size appears reduced
- Verify touch area meets accessibility standards

**Refactor:**
- Optimize touch handling
- Clean up accessibility implementation

#### Phase 4: Cross-Platform Tests
**Red:**
- Write tests for web platform rendering
- Write tests for iOS/Android specific behavior
- Write tests for different screen sizes
- Tests should verify consistency

**Green:**
- Implement platform-specific adjustments if needed
- Ensure consistent overlap across platforms
- Test on multiple device sizes

**Refactor:**
- Consolidate platform code
- Extract shared constants

## Test Categories

### Unit Tests

#### GameScreen Component Tests
- **Layout Structure**
  - Score circle renders with higher z-index
  - Decrement button renders with lower z-index
  - Decrement button positioned to overlap score circle
  - Overlap calculation is correct (20% of button height)

- **Positioning**
  - Decrement button top position calculated correctly
  - Negative margin or absolute positioning applied
  - Button appears below score circle in DOM/component tree
  - Visual stacking order correct

- **Content Visibility**
  - "-" symbol fully visible (not covered)
  - Button container partially hidden (top 20%)
  - Text centered within visible portion

#### Accessibility Tests
- **Touch Targets**
  - Decrement button maintains 44x44 minimum touch area
  - Button remains tappable despite overlap
  - hitSlop applied if necessary
  - Touch area doesn't conflict with score circle

- **Screen Readers**
  - Accessibility labels preserved
  - Button role maintained
  - Reading order logical

### Integration Tests
- **User Interaction**
  - Tapping decrement button decrements score
  - Tapping score circle increments score
  - No touch conflicts between overlapped elements
  - Works in both portrait and landscape

- **Visual Grouping**
  - Elements appear as cohesive unit
  - Overlap maintained during orientation changes
  - Layout scales appropriately on different devices

### Visual Regression Tests
- Snapshot test for portrait mode
- Snapshot test for landscape mode
- Snapshot test for different team colors
- Snapshot test for different screen sizes

## Architecture Design

### Current Structure
```
<View style={styles.teamSide}>
  <ScoreArea /> // 150px circle
  <DecrementButton /> // 60px circle, separate
</View>

styles = {
  scoreArea: {
    width: 150,
    height: 150,
    marginBottom: 10, // Gap between elements
  },
  decrementButton: {
    width: 60,
    height: 60,
  }
}
```

### Target Structure
```
<View style={styles.teamSide}>
  <ScoreArea style={{ zIndex: 2 }} /> // 150px circle, higher z-index
  <DecrementButton style={{ zIndex: 1, marginTop: -12 }} /> // 60px circle, overlapped
</View>

styles = {
  scoreArea: {
    width: 150,
    height: 150,
    marginBottom: LAYOUT_CONSTANTS.SCORE_AREA_MARGIN_BOTTOM,
    zIndex: 2, // Higher layer
  },
  decrementButton: {
    width: 60,
    height: 60,
    marginTop: BUTTON_OVERLAP_OFFSET, // Negative value
    zIndex: 1, // Lower layer
  }
}
```

### Layout Constants
```typescript
const LAYOUT_CONSTANTS = {
  SCORE_CIRCLE_SIZE: 150,
  DECREMENT_BUTTON_SIZE: 60,
  BUTTON_OVERLAP_PERCENTAGE: 0.20, // 20%
  BUTTON_OVERLAP_OFFSET: -12, // -(60 * 0.20) = -12px
  SCORE_AREA_MARGIN_BOTTOM: 10, // Reduced from previous value
};
```

### Calculation
```typescript
// Overlap calculation
const overlapOffset = -(DECREMENT_BUTTON_SIZE * BUTTON_OVERLAP_PERCENTAGE);
// Result: -(60 * 0.20) = -12px

// This moves the button up by 12px, hiding top 20% behind score circle
```

## Implementation Phases

### Phase 1: Layout Constants
1. Define overlap percentage constant (20%)
2. Calculate overlap offset value (-12px)
3. Update LAYOUT_CONSTANTS object
4. Document calculation formula

### Phase 2: Score Circle Z-Index
1. Add zIndex: 2 to scoreArea style
2. Test score circle renders above other elements
3. Verify no visual regressions

### Phase 3: Decrement Button Positioning
1. Add zIndex: 1 to decrementButton style
2. Add negative marginTop (overlap offset)
3. Test button appears behind score circle
4. Verify 20% overlap calculation

### Phase 4: Text Visibility
1. Verify "-" symbol remains visible
2. Adjust text positioning if needed
3. Test with different font sizes
4. Ensure centering within visible area

### Phase 5: Touch Targets
1. Test button remains tappable
2. Add hitSlop if touch area reduced
3. Verify minimum 44x44 touch target
4. Test no touch conflicts

### Phase 6: Responsive Behavior
1. Test in portrait orientation
2. Test in landscape orientation
3. Test on different screen sizes
4. Verify consistent overlap percentage

### Phase 7: Cross-Platform Testing
1. Test on iOS simulator
2. Test on Android emulator
3. Test on web browser
4. Fix platform-specific issues

## Testing Strategy

### Test Data
- Score values: 0, 5, 15, 99
- Button sizes: 60px (current)
- Score circle sizes: 150px (current)
- Overlap percentages: 20%

### Test Scenarios

1. **Visual Grouping**
   - Score circle and decrement button appear as single unit
   - Top 20% of button hidden behind circle
   - Clean, minimalist appearance achieved
   - No gap between elements

2. **Functionality**
   - Decrement button decrements score from 1 to 0
   - Decrement button does not go below 0
   - Button responds to touch immediately
   - No accidental score circle taps when tapping button

3. **Accessibility**
   - Screen reader announces button correctly
   - Touch target meets 44x44 minimum
   - Button accessible via keyboard navigation (web)
   - Visual overlap doesn't affect usability

4. **Responsive**
   - Overlap maintained when rotating device
   - Overlap consistent across screen sizes
   - No layout breaks on small screens
   - Overlap percentage remains 20%

5. **Cross-Platform**
   - Looks identical on iOS and Android
   - Web version matches native appearance
   - Z-index behavior consistent
   - Touch handling platform-appropriate

### Edge Cases
- Very large score numbers (3+ digits)
- Rapid tapping on decrement button
- Simultaneous tapping of both circles
- Extreme screen sizes (very small/large)
- Accessibility zoom enabled

### Coverage Goals
- Maintain 90% overall coverage
- 100% coverage of new positioning code
- All interaction paths tested
- All orientations tested

## Definition of Done

### Code Complete
- [ ] Z-index added to score circle (zIndex: 2)
- [ ] Z-index added to decrement button (zIndex: 1)
- [ ] Negative margin applied for 20% overlap
- [ ] Layout constants defined and documented
- [ ] All tests passing
- [ ] Code coverage ≥ 90%
- [ ] TypeScript type checking passing
- [ ] ESLint passing with 0 warnings

### Visual Complete
- [ ] Decrement button appears behind score circle
- [ ] Top 20% of button hidden by score circle
- [ ] "-" symbol fully visible and centered
- [ ] Elements appear as cohesive visual group
- [ ] Clean, minimalist appearance achieved
- [ ] Consistent in portrait and landscape modes

### Functionality Complete
- [ ] Decrement button fully functional
- [ ] Touch targets meet accessibility standards
- [ ] No touch conflicts between elements
- [ ] Screen reader accessibility maintained
- [ ] Works on iOS, Android, and web

### Quality Complete
- [ ] No visual regressions
- [ ] Performance unchanged
- [ ] Accessibility maintained
- [ ] Responsive across screen sizes
- [ ] Cross-platform consistency verified

## Acceptance Criteria

1. **Visual Overlap**
   - The decrement button is visually positioned behind the score circle
   - Exactly 20% of the decrement button's height is hidden behind the score circle
   - The overlap creates a clean, minimalist grouped appearance
   - The "-" symbol remains fully visible within the visible portion of the button

2. **Z-Index Layering**
   - The score circle has a higher z-index than the decrement button
   - The decrement button appears to be "tucked behind" the score circle
   - The layering is consistent across all platforms and orientations

3. **Positioning Calculation**
   - The overlap is calculated as 20% of the decrement button size (12px for 60px button)
   - A negative top margin of -12px is applied to the decrement button
   - The calculation is defined using constants for maintainability

4. **Functionality Preserved**
   - The decrement button remains fully tappable
   - Tapping the decrement button decrements the score
   - Tapping the score circle increments the score
   - No touch conflicts between the overlapped elements
   - Minimum 44x44 touch target maintained

5. **Responsive Behavior**
   - The overlap is maintained in portrait orientation
   - The overlap is maintained in landscape orientation
   - The 20% overlap percentage is consistent across different screen sizes
   - The visual grouping adapts appropriately

6. **Accessibility**
   - Screen readers correctly identify the decrement button
   - Accessibility labels preserved ("Decrement [team] score")
   - Touch targets meet WCAG accessibility standards
   - The visual overlap doesn't impair usability

7. **Cross-Platform Consistency**
   - The overlapped layout appears identical on iOS
   - The overlapped layout appears identical on Android
   - The overlapped layout appears identical on web
   - Z-index behavior is consistent across platforms

8. **Code Quality**
   - All tests pass (172+ tests)
   - Test coverage remains ≥ 90%
   - No TypeScript errors
   - No ESLint warnings
   - Code is well-documented with comments explaining the overlap technique

## Notes

### Design Rationale
- **20% Overlap**: Provides noticeable visual grouping without obscuring too much of the button
- **Behind Positioning**: Creates depth and hierarchy (main action = score circle on top)
- **Minimalist**: Reduces visual clutter by eliminating gap between elements
- **Cohesive**: Elements feel like a single interactive unit rather than separate controls

### Technical Considerations
- **Z-Index**: React Native supports zIndex on iOS and Android; ensure web also supports it
- **Negative Margin**: Preferred over absolute positioning for simpler layout flow
- **Touch Handling**: Overlapped elements may require careful touch target management
- **Platform Differences**: Test thoroughly on all platforms as z-index can behave differently

### Alternative Approaches Considered
1. **Absolute Positioning**: More complex, harder to maintain responsive layout
2. **Transform**: Could use translateY, but negative margin is simpler
3. **Different Overlap %**: 20% chosen as optimal balance between grouping and visibility

### Future Enhancements
- Could apply same technique to other stacked elements
- Could make overlap percentage configurable
- Could animate the overlap on certain interactions
- Could add subtle shadow to enhance depth perception

### Risk Assessment
- **Low Risk**: Purely visual change, functionality unchanged
- **Touch Conflicts**: Requires testing but unlikely with proper z-index
- **Platform Differences**: May need minor adjustments per platform
- **Easy Rollback**: Can revert by removing negative margin and z-index

### Visual Reference
```
Before:
┌─────────────┐
│   Score     │  150px circle
│     15      │
└─────────────┘
      ↓ gap
   ┌─────┐
   │  -  │        60px circle
   └─────┘

After:
┌─────────────┐
│   Score     │  150px circle (z-index: 2)
│     15      │
└──────┬──────┘
   ┌───┴───┐      60px circle (z-index: 1)
   │   -   │      Top 20% hidden
   └───────┘
```

## Test Plan Summary

### Unit Tests (New/Modified)
- GameScreen layout tests: z-index verification
- GameScreen positioning tests: overlap calculation
- Decrement button tests: functionality preserved
- Touch target tests: minimum size maintained

### Integration Tests
- User interaction: tapping both circles
- Orientation change: overlap maintained
- Screen size variations: responsive behavior

### Visual Tests
- Snapshot tests for portrait mode
- Snapshot tests for landscape mode
- Snapshot tests for different scores

### Accessibility Tests
- Screen reader compatibility
- Touch target sizes
- Keyboard navigation (web)

### Total Test Count
- Estimated 8-12 new tests
- No tests removed
- Final count: ~180-184 tests
- Coverage target: ≥90%
