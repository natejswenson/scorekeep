# Remove Total Games Controls Specification

## Feature Description
Remove the increment/decrement buttons that appear beside the total game counter at the top of the screen. The increment/decrement controls should only appear next to the individual team "Games Won" values, not beside the total game number.

## Requirements

### Functional Requirements
1. Remove increment/decrement buttons from the TallyControls component (top center of screen)
2. The total game counter should display as read-only text showing the game number
3. Team-specific games won increment/decrement controls should remain in TeamWinsTally components
4. Total games calculation should remain: `team1Wins + team2Wins + 1`
5. The total game counter should continue to update automatically when team wins change

### Non-Functional Requirements
1. Maintain existing test coverage (90% threshold)
2. Preserve visual consistency with overall app design
3. Ensure the total game counter remains clearly visible
4. Maintain responsive layout in portrait and landscape modes
5. No breaking changes to Redux state management

## Current State Analysis

### Current Components
- **TallyControls**: Contains increment/decrement buttons for both teams and TotalGameCounter
- **TotalGameCounter**: Displays the total game number
- **TeamWinsTally**: Has inline controls for individual team games won (just implemented)

### Components to Modify
- **TallyControls**: Remove team control buttons, keep only TotalGameCounter
- **GameScreen**: Remove TallyControls handlers, simplify top controls area

### Components to Keep
- **TotalGameCounter**: Keep as-is (read-only display)
- **TeamWinsTally**: Keep as-is (has inline controls)

## TDD Plan

### Red-Green-Refactor Cycle

#### Phase 1: Update TallyControls Tests
**Red:**
- Update TallyControls tests to expect only TotalGameCounter (no buttons)
- Tests should fail because buttons still exist
- Remove tests for button interactions
- Keep tests for TotalGameCounter rendering and updates

**Green:**
- Simplify TallyControls to only render TotalGameCounter
- Remove all button-related code
- Remove props for handlers

**Refactor:**
- Clean up component structure
- Update component documentation
- Simplify prop interface

#### Phase 2: Update GameScreen Tests
**Red:**
- Update GameScreen tests to expect simplified top controls
- Remove expectations for TallyControls button handlers
- Tests should verify TotalGameCounter is still rendered

**Green:**
- Remove handler props passed to TallyControls
- Simplify top controls container if needed

**Refactor:**
- Clean up unused handler functions
- Optimize component structure

#### Phase 3: Integration Tests
**Red:**
- Update GameWinsIntegration tests if they reference TallyControls buttons
- Ensure tests focus on TeamWinsTally controls only

**Green:**
- Update integration tests to use TeamWinsTally controls
- Verify total games counter updates correctly

**Refactor:**
- Consolidate test helpers
- Remove obsolete test utilities

## Test Categories

### Unit Tests

#### TallyControls Component Tests
- **Rendering**
  - Renders TotalGameCounter component
  - Does NOT render increment buttons
  - Does NOT render decrement buttons
  - Does NOT render team control containers

- **Display**
  - Displays correct total games (team1Wins + team2Wins + 1)
  - Updates when team wins change
  - Maintains layout styling

- **Props**
  - Accepts team1Wins prop
  - Accepts team2Wins prop
  - Does NOT accept handler props

#### GameScreen Component Tests
- **Top Controls**
  - Renders top controls container
  - Renders TotalGameCounter in top controls
  - Does NOT pass handler props to TallyControls

### Integration Tests
- **Games Won Workflow**
  - Incrementing team wins via TeamWinsTally updates total counter
  - Decrementing team wins via TeamWinsTally updates total counter
  - Total games counter shows correct calculation

### Cleanup Tests
- Verify removed tests no longer exist
- Ensure no orphaned test utilities
- Validate all test suites still pass

## Architecture Design

### Before (Current State)
```
TallyControls
├── Team 1 Controls (column)
│   ├── Decrement Button
│   └── Increment Button
├── TotalGameCounter
└── Team 2 Controls (column)
    ├── Decrement Button
    └── Increment Button
```

### After (Target State)
```
TallyControls
└── TotalGameCounter (read-only)
```

### Props Interface Change

**Before:**
```typescript
interface TallyControlsProps {
  team1Wins: number;
  team2Wins: number;
  onIncrementTeam1: () => void;
  onDecrementTeam1: () => void;
  onIncrementTeam2: () => void;
  onDecrementTeam2: () => void;
}
```

**After:**
```typescript
interface TallyControlsProps {
  team1Wins: number;
  team2Wins: number;
}
```

### GameScreen Changes

**Before:**
```tsx
<TallyControls
  team1Wins={gameWins.team1}
  team2Wins={gameWins.team2}
  onIncrementTeam1={handleIncrementTeam1Wins}
  onDecrementTeam1={handleDecrementTeam1Wins}
  onIncrementTeam2={handleIncrementTeam2Wins}
  onDecrementTeam2={handleDecrementTeam2Wins}
/>
```

**After:**
```tsx
<TallyControls
  team1Wins={gameWins.team1}
  team2Wins={gameWins.team2}
/>
```

## Implementation Phases

### Phase 1: Test Updates
1. Update TallyControls.test.tsx
   - Remove button rendering tests
   - Remove button interaction tests
   - Remove accessibility tests for buttons
   - Keep TotalGameCounter tests
   - Keep layout tests (simplified)

2. Update GameScreen tests
   - Remove TallyControls handler tests
   - Keep top controls rendering tests
   - Verify TotalGameCounter still works

3. Update integration tests
   - Remove references to TallyControls buttons
   - Focus on TeamWinsTally controls

### Phase 2: Component Implementation
1. Simplify TallyControls component
   - Remove all TouchableOpacity buttons
   - Remove handler props from interface
   - Keep only TotalGameCounter rendering
   - Update component documentation

2. Update GameScreen component
   - Remove handler props from TallyControls usage
   - Optionally simplify topControls styles
   - Keep handler functions for TeamWinsTally

### Phase 3: Cleanup
1. Remove unused code
   - Delete handler functions if only used by TallyControls
   - Actually, keep handlers - they're used by TeamWinsTally
   - Clean up imports if any become unused

2. Update documentation
   - Update component comments
   - Update CLAUDE.md if needed

### Phase 4: Verification
1. Run all tests
2. Verify 90% coverage maintained
3. Run linting
4. Run type checking

## Testing Strategy

### Test Data
- Team wins: 0, 1, 5, 10
- Total games: 1, 2, 6, 11, 21

### Test Scenarios

1. **Component Rendering**
   - TallyControls renders with only TotalGameCounter
   - No buttons are present in component tree
   - Layout is simplified and centered

2. **Total Games Calculation**
   - With team1=0, team2=0: total=1
   - With team1=2, team2=3: total=6
   - With team1=10, team2=10: total=21

3. **Updates**
   - Changing team1Wins updates total
   - Changing team2Wins updates total
   - Component re-renders correctly

4. **Integration**
   - TeamWinsTally controls work independently
   - Changes reflect in top TotalGameCounter
   - No broken handlers or props

### Coverage Goals
- Maintain 90% overall coverage
- 100% coverage of simplified TallyControls
- All interaction paths via TeamWinsTally tested

## Definition of Done

### Code Complete
- [ ] TallyControls component simplified (buttons removed)
- [ ] TallyControls props interface updated (handlers removed)
- [ ] GameScreen updated (no handler props to TallyControls)
- [ ] All tests updated and passing
- [ ] Code coverage ≥ 90%
- [ ] TypeScript type checking passing
- [ ] ESLint passing with 0 warnings

### Tests Complete
- [ ] TallyControls tests updated (no button tests)
- [ ] GameScreen tests updated (no handler tests)
- [ ] Integration tests updated (focus on TeamWinsTally)
- [ ] All removed tests documented
- [ ] All new/updated tests passing

### Functionality Complete
- [ ] TallyControls displays only total game number
- [ ] No increment/decrement buttons in top controls
- [ ] TeamWinsTally controls still work for both teams
- [ ] Total games counter updates when team wins change
- [ ] Layout looks clean and centered

### Quality Complete
- [ ] No visual regressions
- [ ] Responsive layout maintained
- [ ] Accessibility maintained (where applicable)
- [ ] Performance remains optimal
- [ ] Code follows project conventions
- [ ] Documentation updated

## Acceptance Criteria

1. **TallyControls Component**
   - The TallyControls component renders only the TotalGameCounter
   - No increment buttons are visible in the top controls area
   - No decrement buttons are visible in the top controls area
   - The component accepts only team1Wins and team2Wins props

2. **Total Game Counter**
   - The total game number is displayed in the top center of the screen
   - The total is calculated as: team1Wins + team2Wins + 1
   - The counter updates automatically when team wins change
   - The counter is read-only (no direct interaction)

3. **Team Games Won Controls**
   - Team 1 games won controls appear in TeamWinsTally component (bottom left in portrait, left side in landscape)
   - Team 2 games won controls appear in TeamWinsTally component (bottom right in portrait, right side in landscape)
   - Both teams have working increment (+) and decrement (-) buttons
   - Changes to team wins update the top total game counter

4. **Layout and Styling**
   - The top controls area is simplified and centered
   - The total game counter is clearly visible
   - Layout works in both portrait and landscape orientations
   - No layout regressions or visual glitches

5. **Code Quality**
   - All tests pass (182 tests or adjusted count)
   - Test coverage remains at or above 90%
   - No TypeScript errors
   - No ESLint warnings
   - Code is clean and well-documented

## Notes

### Why This Change
- Reduces duplication: games won controls appeared in two places (top and bottom)
- Improves clarity: total game number is now clearly read-only
- Simplifies UI: cleaner top area with just the game number
- Aligns with recent change: inline controls in TeamWinsTally make top controls redundant

### User Impact
- Users now adjust games won using only the controls next to each team's tally
- The top counter becomes a pure display element showing which game is being played
- More intuitive: controls are co-located with the values they modify

### Technical Considerations
- Handler functions in GameScreen are still needed for TeamWinsTally
- Redux actions remain unchanged
- State management remains unchanged
- Only UI component structure changes

### Risk Assessment
- **Low Risk**: This is primarily a UI simplification
- Tests will catch any regressions
- No changes to state management or business logic
- Easy to revert if needed
