# Specification: Landscape View Redesign

## Overview
Update the landscape view to have a similar minimalist look and feel as the newly implemented portrait view with floating score cards, focusing on large dominant scores and clean visual hierarchy.

## Requirements

### Functional Requirements
1. **Large Dominant Scores**
   - Increase score font size to 240pt (matching portrait)
   - Remove or minimize team name display
   - Score should be the primary visual element

2. **Clean Visual Design**
   - Maintain side-by-side red/blue layout for landscape
   - Apply similar styling: semi-transparent controls, clean spacing
   - Consistent button styling with portrait (smaller, less obtrusive)

3. **Games Won Display**
   - Reduce games won prominence (matching portrait 28pt font)
   - Position at bottom of each side
   - Inline increment/decrement controls

4. **Reset Button**
   - Match portrait styling: 56px, semi-transparent white
   - Center positioned between teams

5. **Top Tally Badge**
   - Match portrait design: white badge with score tally
   - Positioned at top center

6. **Decrement Buttons**
   - Maintain overlapped design for scores
   - Semi-transparent background
   - Positioned beside score circle

### Non-Functional Requirements
1. **Consistency**: Visual consistency between portrait and landscape modes
2. **Test Coverage**: Maintain 90%+ coverage on all metrics
3. **Performance**: No performance degradation
4. **Backward Compatibility**: Existing landscape functionality preserved

## Current State Analysis

### Current Landscape Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    [Top Tally Counter]                      │
│                                                             │
│  RED SIDE                │                 BLUE SIDE        │
│  Team Name               │                 Team Name        │
│  [Large Circle: 72pt]    │                 [Large Circle]   │
│  [- Button]              │                 [- Button]       │
│  Games Won: [- 0 +]      │                 Games Won: [-0+] │
│                          │                                  │
│                     [Reset ↻]                               │
└─────────────────────────────────────────────────────────────┘
```

### Target Landscape Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    [Tally Badge: 0-0]                       │
│                                                             │
│  RED SIDE                │                 BLUE SIDE        │
│                          │                                  │
│  [240pt Score]           │                 [240pt Score]    │
│    [-]                   │                   [-]            │
│                          │                                  │
│                          │                                  │
│                     [Small ↻]                               │
│                          │                                  │
│  Games: [- 0 +]          │                 Games: [- 0 +]   │
└─────────────────────────────────────────────────────────────┘
```

## TDD Implementation Plan

### Phase 1: Update Score Display (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Landscape Score Display', () => {
  it('should render score with 240pt font in landscape', () => {
    // Test score font size matches portrait (240pt)
  });

  it('should hide or minimize team name in landscape', () => {
    // Test team name is removed or minimized
  });

  it('should maintain side-by-side layout', () => {
    // Test red/blue sides remain split
  });
});
```

#### Green: Implement Changes
- Update `styles.score` fontSize from 72pt to 240pt
- Update lineHeight accordingly
- Remove or minimize TeamNameDisplay component
- Adjust spacing for larger scores

#### Refactor
- Extract common score styles between portrait/landscape
- Create shared constants for font sizes

### Phase 2: Update Games Won Display (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Landscape Games Won Display', () => {
  it('should render games won with 28pt font', () => {
    // Test font size matches portrait
  });

  it('should position games won at bottom of team sides', () => {
    // Test vertical positioning
  });

  it('should use inline controls matching portrait', () => {
    // Test button sizes and styling
  });
});
```

#### Green: Implement Changes
- Update `styles.gamesText` fontSize to 28pt (from current size)
- Adjust `styles.smallButton` to match portrait (32px)
- Update positioning with flexbox (justifyContent: 'space-between')

#### Refactor
- Share TeamWinsTally styles between modes
- Consolidate button styling

### Phase 3: Update Control Buttons (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Landscape Control Buttons', () => {
  it('should render reset button with 56px size', () => {
    // Test reset button matches portrait styling
  });

  it('should render decrement buttons with semi-transparent background', () => {
    // Test decrement button styling
  });

  it('should maintain overlapped button positioning', () => {
    // Test z-index and margin overlap
  });
});
```

#### Green: Implement Changes
- Update `styles.resetButton` to 56px (from 70px)
- Add semi-transparent background: rgba(255, 255, 255, 0.9)
- Update `styles.decrementButton` to match portrait styling
- Adjust shadows and elevation

#### Refactor
- Create shared button component or styles
- Extract common styling constants

### Phase 4: Update Top Tally Display (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Landscape Top Tally', () => {
  it('should render tally badge matching portrait design', () => {
    // Test badge styling matches portrait
  });

  it('should position at top center', () => {
    // Test positioning
  });

  it('should not show increment/decrement buttons', () => {
    // Test TallyControls is replaced with simple badge
  });
});
```

#### Green: Implement Changes
- Replace TallyControls with simple tally badge (matching portrait)
- Apply `styles.tallyBadge` from portrait
- Remove increment/decrement from top display
- Update positioning to top center

#### Refactor
- Consider shared TallyBadge component for both modes

### Phase 5: Visual Polish & Consistency (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Landscape Visual Consistency', () => {
  it('should use consistent spacing with portrait', () => {
    // Test padding, margins match design
  });

  it('should use consistent colors and opacity', () => {
    // Test color values match
  });

  it('should have consistent shadow/elevation', () => {
    // Test shadow properties
  });
});
```

#### Green: Implement Changes
- Audit all spacing values against portrait
- Update colors, opacity, shadows to match
- Ensure consistent border radius values

#### Refactor
- Extract all magic numbers to constants
- Create design system constants file
- Document design tokens

## Test Categories

### Unit Tests
- **Component Tests**: FloatingScoreCard, GameScreen, TeamWinsTally
- **Hook Tests**: useOrientation, useIsLandscape
- **Style Tests**: Verify font sizes, colors, dimensions

### Integration Tests
- **Layout Tests**: Score positioning, button placement
- **Interaction Tests**: Increment/decrement, reset functionality
- **Orientation Tests**: Switch between landscape/portrait

### Visual Regression Tests (Manual)
- Side-by-side comparison with portrait mode
- Verify visual consistency across devices
- Test on different screen sizes

## Architecture Design

### Component Structure
```
GameScreen (updated)
├── if (isLandscape)
│   ├── View (container)
│   │   ├── View (teamSide - red)
│   │   │   ├── Text (large score - 240pt)
│   │   │   ├── TouchableOpacity (decrement)
│   │   │   └── TeamWinsTally (inline controls)
│   │   ├── View (teamSide - blue)
│   │   │   ├── Text (large score - 240pt)
│   │   │   ├── TouchableOpacity (decrement)
│   │   │   └── TeamWinsTally (inline controls)
│   │   ├── View (topControls)
│   │   │   └── View (tallyBadge) - Text (0-0)
│   │   └── View (middleControls)
│   │       └── TouchableOpacity (reset - 56px)
```

### Shared Styles/Constants
```typescript
const DESIGN_CONSTANTS = {
  SCORE_FONT_SIZE: 240,
  GAMES_FONT_SIZE: 28,
  RESET_BUTTON_SIZE: 56,
  SMALL_BUTTON_SIZE: 32,
  DECREMENT_BUTTON_SIZE: 52,
};
```

## Implementation Phases

### Phase 1: Preparation (0.5 hours)
- [ ] Review portrait implementation
- [ ] Identify reusable components/styles
- [ ] Create shared constants file
- [ ] Write test plan document

### Phase 2: Score Display Update (1 hour)
- [ ] Write failing tests for score display
- [ ] Update score font size to 240pt
- [ ] Remove/minimize team names
- [ ] Adjust spacing and layout
- [ ] Run tests (Green)
- [ ] Refactor for shared styles

### Phase 3: Games Won Update (1 hour)
- [ ] Write failing tests for games won
- [ ] Update font size to 28pt
- [ ] Update button sizes to 32px
- [ ] Position at bottom
- [ ] Run tests (Green)
- [ ] Refactor for reusability

### Phase 4: Control Buttons (1 hour)
- [ ] Write failing tests for buttons
- [ ] Update reset button to 56px
- [ ] Update styling (semi-transparent)
- [ ] Update decrement buttons
- [ ] Run tests (Green)
- [ ] Refactor shared button styles

### Phase 5: Top Tally (0.5 hours)
- [ ] Write failing tests for tally
- [ ] Replace TallyControls with badge
- [ ] Match portrait styling
- [ ] Run tests (Green)
- [ ] Refactor if needed

### Phase 6: Visual Polish (1 hour)
- [ ] Write consistency tests
- [ ] Audit all spacing/colors
- [ ] Update shadows and borders
- [ ] Run all tests
- [ ] Manual visual testing

### Phase 7: Testing & Documentation (1 hour)
- [ ] Run full test suite
- [ ] Verify 90%+ coverage
- [ ] Manual testing on multiple screens
- [ ] Update CLAUDE.md if needed
- [ ] Create PR with screenshots

**Total Estimated Time: 6 hours**

## Testing Strategy

### Automated Testing
1. **Unit Tests**: Test each style change individually
2. **Integration Tests**: Test layout and interactions
3. **Coverage Tests**: Maintain 90%+ on all metrics
4. **Regression Tests**: Ensure portrait still works

### Manual Testing
1. **Visual Comparison**: Portrait vs Landscape consistency
2. **Different Screens**: Test on various landscape sizes
3. **Interactions**: Verify all buttons work correctly
4. **Orientation Switch**: Test smooth transition

### Test Coverage Goals
- Statement Coverage: 100%
- Branch Coverage: 97%+
- Function Coverage: 100%
- Line Coverage: 100%

## Definition of Done

### Code Complete
- [ ] All TDD phases completed (Red-Green-Refactor)
- [ ] Score display: 240pt font in landscape
- [ ] Team names removed/minimized
- [ ] Games won: 28pt font, inline controls
- [ ] Reset button: 56px, semi-transparent
- [ ] Top tally: badge style (no buttons)
- [ ] Decrement buttons: matching portrait style

### Testing Complete
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Coverage maintains 90%+ thresholds
- [ ] Manual visual testing completed
- [ ] No regressions in portrait mode

### Quality Standards
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: No type errors
- [ ] Code reviewed (self or peer)
- [ ] Performance: No degradation

### Documentation
- [ ] CLAUDE.md updated if needed
- [ ] PR description with before/after screenshots
- [ ] Test changes documented
- [ ] Design decisions documented

## Acceptance Criteria

### Visual Consistency
1. Score font size matches portrait (240pt)
2. Games won font size matches portrait (28pt)
3. Reset button size matches portrait (56px)
4. Button styling consistent (colors, opacity, shadows)
5. Top tally badge matches portrait design
6. Overall minimalist aesthetic consistent

### Functional Requirements
1. All score increment/decrement works
2. All games won increment/decrement works
3. Reset button works correctly
4. Side-by-side layout maintained for landscape
5. No loss of functionality from previous version

### Technical Requirements
1. Test coverage ≥ 90% (all metrics)
2. No ESLint errors or warnings
3. No TypeScript errors
4. Code follows existing patterns
5. Performance maintained

### User Experience
1. Large, readable scores
2. Easy-to-tap controls
3. Clean, uncluttered interface
4. Smooth orientation transitions
5. Consistent experience between modes

## Risk Assessment

### Low Risk
- Font size changes (well-tested)
- Button size adjustments (isolated changes)
- Color/styling updates (visual only)

### Medium Risk
- Layout restructuring (may affect positioning)
- Removing team names (may affect edit functionality)
- Shared component refactoring (may affect both modes)

### Mitigation Strategies
- Comprehensive test coverage before changes
- Incremental changes with frequent testing
- Keep portrait mode tests running
- Manual testing after each phase
- Easy rollback strategy (git branches)

## Success Metrics

### Quantitative
- Test coverage: ≥ 90% (all metrics)
- Build time: No increase
- Bundle size: Minimal increase (<5%)
- Test execution time: <15 seconds

### Qualitative
- Visual consistency with portrait
- Improved aesthetics
- Cleaner interface
- Positive user feedback

## Notes

### Design Decisions
1. **Keep Side-by-Side Layout**: Landscape naturally supports horizontal split
2. **Remove Team Names**: Matches portrait minimalism
3. **240pt Scores**: Dominant visual element
4. **Top Tally Badge**: Simpler than controls, matches portrait
5. **Bottom Games Won**: Natural position with inline controls

### Future Enhancements
1. Consider animated transitions between portrait/landscape
2. Explore haptic feedback on button presses
3. Consider customizable color themes
4. Explore gesture controls (swipe to increment)

### References
- Portrait implementation: `src/components/FloatingScoreCard.tsx`
- Current landscape: `src/components/GameScreen.tsx` (landscape section)
- Design constants: To be created in Phase 1
