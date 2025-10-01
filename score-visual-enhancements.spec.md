# Score Visual Enhancements Specification

## Feature Description
Enhance the visual prominence of the score by making it larger and increasing the score circle size. Remove the border outline from the decrement button for a cleaner, more minimalist appearance.

## Requirements

### Functional Requirements
1. Increase the score circle size to draw more attention
2. Increase the score font size for better readability and prominence
3. Remove the border outline from the decrement button
4. Maintain all touch functionality and accessibility
5. Preserve the 45% overlap between score circle and decrement button
6. Keep minimum 44x44 touch targets for accessibility

### Visual Requirements
1. **Score Circle**: Increase size from 150px to provide more visual weight
2. **Score Font**: Increase font size from 72px for greater prominence
3. **Decrement Button**: Remove 2px white border for cleaner appearance
4. **Visual Hierarchy**: Score should be the most prominent element on each team side

### Non-Functional Requirements
1. Maintain existing touch interaction functionality
2. Preserve accessibility for screen readers
3. No performance degradation
4. Consistent behavior across iOS, Android, and web platforms
5. Maintain 90% test coverage threshold

## Current State Analysis

### Current Implementation
- **Score Circle**: 150px diameter with 3px white border
- **Score Font**: 72px, bold, white
- **Decrement Button**: 60px diameter with 2px white border
- **Overlap**: 45% of decrement button behind score circle (-27px margin)

### Target Implementation
- **Score Circle**: 200px diameter (increased from 150px)
- **Score Font**: 96px (increased from 72px)
- **Decrement Button**: 60px diameter, **no border** (removed 2px white border)
- **Overlap**: Recalculate to maintain 45% visual overlap with new circle size

## TDD Plan

### Red-Green-Refactor Cycle

#### Phase 1: Score Circle Size Tests
**Red:**
- Write tests verifying score circle is 200px x 200px
- Write tests verifying border radius is 100px (half of 200px)
- Tests should fail because current size is 150px

**Green:**
- Update SCORE_CIRCLE_SIZE constant to 200
- Update scoreArea width and height to 200
- Update borderRadius to 100

**Refactor:**
- Ensure constant is used consistently
- Update any related calculations

#### Phase 2: Score Font Size Tests
**Red:**
- Write tests verifying score font size is 96px
- Tests should fail because current size is 72px

**Green:**
- Update score fontSize to 96

**Refactor:**
- Consider extracting as constant if needed

#### Phase 3: Decrement Button Border Tests
**Red:**
- Write tests verifying decrement button has no borderWidth
- Write tests verifying decrement button has no borderColor
- Tests should fail because current button has 2px border

**Green:**
- Remove borderWidth from decrementButton style
- Remove borderColor from decrementButton style

**Refactor:**
- Clean up any unused border-related code

#### Phase 4: Visual Regression Tests
**Red:**
- Update snapshot tests for new sizes
- Verify visual hierarchy with larger score

**Green:**
- Update components to match new visual design
- Ensure score is most prominent element

**Refactor:**
- Optimize style definitions

## Test Categories

### Unit Tests

#### GameScreen Component Tests
- **Score Circle Size**
  - Width is 200px
  - Height is 200px
  - Border radius is 100px
  - Border styling preserved (3px white)

- **Score Font Size**
  - Font size is 96px
  - Font weight is bold
  - Color is white

- **Decrement Button Styling**
  - No borderWidth property
  - No borderColor property
  - Background color preserved (rgba(0, 0, 0, 0.3))
  - Size remains 60px x 60px

#### Layout Tests
- **Visual Hierarchy**
  - Score circle is larger than decrement button
  - Score is most prominent visual element
  - 45% overlap maintained

- **Touch Targets**
  - Score circle touch area increased with size
  - Decrement button remains 60px (above 44px minimum)
  - No touch conflicts

### Integration Tests
- **User Interaction**
  - Tapping larger score circle increments score
  - Tapping borderless decrement button decrements score
  - No accidental touches
  - Works in both orientations

### Visual Regression Tests
- Snapshot test for new score circle size
- Snapshot test for new score font size
- Snapshot test for borderless decrement button

## Architecture Design

### Current Constants
```typescript
const LAYOUT_CONSTANTS = {
  SCORE_AREA_MARGIN_BOTTOM: 10,
  TOP_CONTROLS_POSITION: '8%' as const,
  MIDDLE_CONTROLS_POSITION: '45%' as const,
  DECREMENT_BUTTON_SIZE: 60,
  BUTTON_OVERLAP_PERCENTAGE: 0.45,
  BUTTON_OVERLAP_OFFSET: -27,
};
```

### Target Constants
```typescript
const LAYOUT_CONSTANTS = {
  SCORE_CIRCLE_SIZE: 200, // New constant
  TOP_CONTROLS_POSITION: '8%' as const,
  MIDDLE_CONTROLS_POSITION: '45%' as const,
  DECREMENT_BUTTON_SIZE: 60,
  BUTTON_OVERLAP_PERCENTAGE: 0.45,
  BUTTON_OVERLAP_OFFSET: -27, // Stays same, calculated from button size
};
```

### Current Styles
```typescript
scoreArea: {
  width: 150,
  height: 150,
  borderRadius: 75,
  borderWidth: 3,
  borderColor: '#FFFFFF',
  zIndex: 2,
}

score: {
  fontSize: 72,
  fontWeight: 'bold',
  color: '#FFFFFF',
}

decrementButton: {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: '#FFFFFF',
  zIndex: 1,
  marginTop: -27,
}
```

### Target Styles
```typescript
scoreArea: {
  width: LAYOUT_CONSTANTS.SCORE_CIRCLE_SIZE, // 200
  height: LAYOUT_CONSTANTS.SCORE_CIRCLE_SIZE, // 200
  borderRadius: LAYOUT_CONSTANTS.SCORE_CIRCLE_SIZE / 2, // 100
  borderWidth: 3,
  borderColor: '#FFFFFF',
  zIndex: 2,
}

score: {
  fontSize: 96, // Increased from 72
  fontWeight: 'bold',
  color: '#FFFFFF',
}

decrementButton: {
  width: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
  height: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
  borderRadius: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE / 2,
  // borderWidth removed
  // borderColor removed
  zIndex: 1,
  marginTop: LAYOUT_CONSTANTS.BUTTON_OVERLAP_OFFSET,
}
```

## Implementation Phases

### Phase 1: Update Layout Constants
1. Add SCORE_CIRCLE_SIZE: 200 to LAYOUT_CONSTANTS
2. Remove SCORE_AREA_MARGIN_BOTTOM if unused
3. Document changes

### Phase 2: Increase Score Circle Size
1. Update scoreArea width to 200
2. Update scoreArea height to 200
3. Update borderRadius to 100
4. Test visual appearance
5. Verify overlap still works

### Phase 3: Increase Score Font Size
1. Update score fontSize to 96
2. Test readability
3. Verify centering in larger circle

### Phase 4: Remove Decrement Button Border
1. Remove borderWidth from decrementButton
2. Remove borderColor from decrementButton
3. Test visual appearance
4. Verify button remains visible

### Phase 5: Update Tests
1. Update size expectations in tests
2. Update font size expectations
3. Remove border expectations
4. Update snapshots if needed

## Testing Strategy

### Test Data
- Score circle size: 200px (new)
- Score font size: 96px (new)
- Decrement button: no border (new)
- Overlap: 45% maintained

### Test Scenarios

1. **Visual Prominence**
   - Score circle is noticeably larger
   - Score font is easier to read
   - Score draws eye attention first
   - Visual hierarchy clear

2. **Clean Appearance**
   - Decrement button has no border outline
   - Minimalist, clean design
   - Button still visible and usable
   - No visual clutter

3. **Functionality**
   - All touch interactions work
   - Score increments on circle tap
   - Score decrements on button tap
   - No regression in behavior

4. **Responsive**
   - Works in portrait mode
   - Works in landscape mode
   - Scales appropriately
   - Overlap maintained

### Edge Cases
- Very large score numbers (3+ digits) in bigger font
- Score circle doesn't overlap other elements
- Borderless button remains visible on both red/blue backgrounds

### Coverage Goals
- Maintain 90% overall coverage
- 100% coverage of new size code
- All visual changes tested

## Definition of Done

### Code Complete
- [ ] SCORE_CIRCLE_SIZE constant added (200)
- [ ] Score circle size updated to 200x200
- [ ] Score font size updated to 96px
- [ ] Decrement button border removed
- [ ] All tests passing
- [ ] Code coverage ≥ 90%
- [ ] TypeScript type checking passing
- [ ] ESLint passing with 0 warnings

### Visual Complete
- [ ] Score circle is 200px diameter
- [ ] Score font is 96px
- [ ] Decrement button has no border outline
- [ ] Visual hierarchy emphasizes score
- [ ] Clean, minimalist appearance
- [ ] Works in portrait and landscape

### Functionality Complete
- [ ] Score circle fully functional
- [ ] Decrement button fully functional
- [ ] Touch targets meet accessibility standards
- [ ] No touch conflicts
- [ ] Works on iOS, Android, and web

### Quality Complete
- [ ] No visual regressions (besides intended changes)
- [ ] Performance unchanged
- [ ] Accessibility maintained
- [ ] Responsive across screen sizes
- [ ] Cross-platform consistency verified

## Acceptance Criteria

1. **Increased Score Circle Size**
   - The score circle is 200px x 200px (increased from 150px)
   - The border radius is 100px (half of diameter)
   - The 3px white border is preserved
   - The score circle is the dominant visual element on each team side

2. **Increased Score Font Size**
   - The score font size is 96px (increased from 72px)
   - The score remains centered within the larger circle
   - The score is easily readable from a distance
   - Bold weight and white color preserved

3. **Borderless Decrement Button**
   - The decrement button has no border outline
   - The borderWidth property is removed from decrementButton style
   - The borderColor property is removed from decrementButton style
   - The button remains visible with rgba(0, 0, 0, 0.3) background
   - The "-" symbol is clearly visible

4. **Visual Hierarchy**
   - The score is the most prominent element on each team side
   - The larger score circle draws attention effectively
   - The borderless decrement button is subtly integrated
   - The design feels cleaner and more minimalist

5. **Functionality Preserved**
   - Tapping the score circle increments the score
   - Tapping the decrement button decrements the score
   - The 45% overlap is maintained visually
   - All touch targets meet accessibility standards
   - No touch conflicts between elements

6. **Responsive Behavior**
   - The new sizes work in portrait orientation
   - The new sizes work in landscape orientation
   - The layout remains balanced with larger score
   - No elements overflow or misalign

7. **Code Quality**
   - All tests pass (182+ tests)
   - Test coverage remains ≥ 90%
   - No TypeScript errors
   - No ESLint warnings
   - Constants used for maintainability

## Notes

### Design Rationale
- **Larger Score Circle**: Emphasizes the primary game element (current score)
- **Larger Font**: Improves readability, especially during active gameplay
- **No Button Border**: Reduces visual noise, cleaner minimalist aesthetic
- **Visual Hierarchy**: Score > Decrement button > Other elements

### Technical Considerations
- Larger circle increases touch target (better UX)
- Overlap percentage stays same, absolute offset unchanged
- Borderless button relies on background opacity for visibility
- Font size increase may affect very large numbers (99+)

### Risk Assessment
- **Low Risk**: Visual enhancement, no functional changes
- **Button Visibility**: Should verify borderless button is visible on both red/blue backgrounds
- **Text Overflow**: Large scores (3+ digits) should be tested in bigger font
- **Easy Rollback**: Can revert size changes if issues arise
