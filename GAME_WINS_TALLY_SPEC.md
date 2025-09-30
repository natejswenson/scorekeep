# Game Wins Tally Feature - TDD Specification

## Overview
Add a game wins tracking system to the ScoreKeep volleyball app, displaying tallies at the bottom of each team and a total game counter above the reset button. This feature tracks matches won across multiple games while maintaining component independence.

## 1. Requirements

### 1.1 Functional Requirements

#### Core Tally Features
- **F1**: Display game wins tally at the bottom of each team section
- **F2**: Show unobtrusive increment/decrement controls in the middle of the screen
- **F3**: Display total game counter above the reset button (sum of both tallies + 1)
- **F4**: Maintain independent tally counts for each team
- **F5**: Persist tally values across game resets (scores reset, tallies remain)
- **F6**: Allow manual increment/decrement of tally values

#### Tally Calculation
- **F7**: Total game counter = Team1 wins + Team2 wins + 1
- **F8**: Default state shows "1" when both teams have 0 wins
- **F9**: Example: Team1=1, Team2=1 → Total displays "3"
- **F10**: Tally values cannot go below 0

#### UI Layout Requirements
- **F11**: Tally displays positioned at bottom of each team section
- **F12**: Tally controls positioned in middle of screen, above reset button
- **F13**: Controls should be unobtrusive and clearly identifiable
- **F14**: Total game counter prominently displayed above reset symbol

#### Component Independence
- **F15**: Game component must remain independent of other screen components
- **F16**: Tally functionality should not interfere with existing scoring
- **F17**: Modular design allowing tally feature to be disabled/removed easily

### 1.2 Non-Functional Requirements

#### Usability
- **NF1**: Tally controls must have minimum 44px touch targets
- **NF2**: Clear visual distinction between score and tally areas
- **NF3**: Intuitive tally increment/decrement interaction
- **NF4**: Total game counter easily readable during play

#### Performance
- **NF5**: No impact on existing score update performance
- **NF6**: Instant visual feedback for tally updates
- **NF7**: Smooth animations for tally changes

#### Technical
- **NF8**: Maintain existing Redux state management patterns
- **NF9**: Preserve 100% test coverage requirement
- **NF10**: Cross-platform compatibility (iOS, Android, Web)
- **NF11**: Component isolation and reusability

## 2. TDD Plan & Test Categories

### 2.1 Red-Green-Refactor Cycle

Each feature will follow strict TDD methodology:
1. **Red**: Write failing tests for tally functionality
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code structure while maintaining tests

### 2.2 Test Categories

#### Unit Tests
- Tally display component rendering
- Tally control component behavior
- Total game counter calculation logic
- Redux reducer tally actions
- Component isolation verification

#### Integration Tests
- Tally and score independence
- Complete tally workflow testing
- State synchronization across components
- Reset button interaction with tallies

#### End-to-End Tests
- Full user interaction flow
- Cross-platform tally functionality
- Multi-game session scenarios

## 3. Architecture Design

### 3.1 State Structure Updates

```typescript
// Extend existing GameState interface
interface GameState {
  team1: Team;
  team2: Team;
  scoreIncrement: number;
  winCondition: number;
  isGameActive: boolean;
  winner: string | null;
  editingTeam: 'team1' | 'team2' | null;
  // New tally tracking
  gameWins: {
    team1: number;
    team2: number;
  };
}

// Team interface remains unchanged
interface Team {
  name: string;
  score: number;
  color: string;
}
```

### 3.2 New Redux Actions

```typescript
// Add to gameSlice
incrementTeam1Wins: (state) => {
  state.gameWins.team1 += 1;
},
incrementTeam2Wins: (state) => {
  state.gameWins.team2 += 1;
},
decrementTeam1Wins: (state) => {
  if (state.gameWins.team1 > 0) {
    state.gameWins.team1 -= 1;
  }
},
decrementTeam2Wins: (state) => {
  if (state.gameWins.team2 > 0) {
    state.gameWins.team2 -= 1;
  }
},
resetGameWins: (state) => {
  state.gameWins.team1 = 0;
  state.gameWins.team2 = 0;
},
// Note: resetScores action should NOT affect gameWins
```

### 3.3 Component Architecture

```typescript
// Enhanced component structure
GameScreen
├── TeamSide (enhanced)
│   ├── TeamNameDisplay (existing)
│   ├── ScoreArea (existing)
│   ├── DecrementButton (existing)
│   └── TeamWinsTally (new)
├── MiddleControls (new)
│   ├── TotalGameCounter (new)
│   ├── TallyControls (new)
│   │   ├── Team1WinControl
│   │   └── Team2WinControl
│   └── ResetButton (existing, moved here)
```

### 3.4 New Components Design

```typescript
// TeamWinsTally Component
interface TeamWinsTallyProps {
  teamId: 'team1' | 'team2';
  wins: number;
  teamColor: string;
}

// TallyControls Component
interface TallyControlsProps {
  team1Wins: number;
  team2Wins: number;
  onIncrementTeam1: () => void;
  onDecrementTeam1: () => void;
  onIncrementTeam2: () => void;
  onDecrementTeam2: () => void;
}

// TotalGameCounter Component
interface TotalGameCounterProps {
  totalGames: number; // team1Wins + team2Wins + 1
}
```

## 4. Implementation Phases

### Phase 1: Redux State & Actions (Week 1)
**Goal**: Implement tally state management

#### Tests to Write:
```javascript
describe('Game Wins Tally State', () => {
  test('should initialize with zero wins for both teams');
  test('should increment team1 wins');
  test('should increment team2 wins');
  test('should decrement team1 wins when positive');
  test('should decrement team2 wins when positive');
  test('should not allow negative win counts');
  test('should reset game wins independently of scores');
  test('should preserve wins when scores are reset');
});
```

#### Features:
- Extend GameState with gameWins object
- Implement tally increment/decrement actions
- Ensure score reset independence

### Phase 2: Tally Display Components (Week 2)
**Goal**: Visual tally display at bottom of team sections

#### Tests to Write:
```javascript
describe('TeamWinsTally Component', () => {
  test('should display current win count');
  test('should render with team-specific styling');
  test('should update when win count changes');
  test('should be positioned at bottom of team section');
});

describe('TotalGameCounter Component', () => {
  test('should calculate total games correctly');
  test('should display "1" when both teams have 0 wins');
  test('should display "3" when team1=1 and team2=1');
  test('should update when win counts change');
});
```

#### Components:
- TeamWinsTally component
- TotalGameCounter component
- Basic styling and positioning

### Phase 3: Tally Controls (Week 3)
**Goal**: Unobtrusive controls for tally management

#### Tests to Write:
```javascript
describe('TallyControls Component', () => {
  test('should render increment/decrement buttons for both teams');
  test('should dispatch correct actions on button press');
  test('should be positioned above reset button');
  test('should have appropriate touch targets');
  test('should provide clear visual feedback');
});
```

#### Features:
- TallyControls component implementation
- Middle screen positioning
- Unobtrusive but accessible design
- Proper touch target sizing

### Phase 4: Integration & Polish (Week 4)
**Goal**: Complete integration and component independence

#### Tests to Write:
```javascript
describe('Game Wins Integration', () => {
  test('should maintain tally independence from scoring');
  test('should preserve tallies when game is reset');
  test('should update total counter when tallies change');
  test('should work alongside team name editing');
  test('should maintain component isolation');
});
```

#### Features:
- Complete GameScreen integration
- Component independence verification
- Visual polish and animations
- Accessibility improvements

## 5. Detailed Component Specifications

### 5.1 TeamWinsTally Component

```typescript
const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  teamColor,
}) => {
  return (
    <View style={styles.tallyContainer}>
      <Text style={[styles.tallyLabel, { color: teamColor }]}>
        Games Won
      </Text>
      <Text style={[styles.tallyCount, { color: teamColor }]}>
        {wins}
      </Text>
    </View>
  );
};
```

### 5.2 TallyControls Component

```typescript
const TallyControls: React.FC<TallyControlsProps> = ({
  team1Wins,
  team2Wins,
  onIncrementTeam1,
  onDecrementTeam1,
  onIncrementTeam2,
  onDecrementTeam2,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.teamControls}>
        <TouchableOpacity onPress={onDecrementTeam1}>
          <Text style={styles.controlButton}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrementTeam1}>
          <Text style={styles.controlButton}>+</Text>
        </TouchableOpacity>
      </View>

      <TotalGameCounter totalGames={team1Wins + team2Wins + 1} />

      <View style={styles.teamControls}>
        <TouchableOpacity onPress={onDecrementTeam2}>
          <Text style={styles.controlButton}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrementTeam2}>
          <Text style={styles.controlButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### 5.3 Layout Structure

```typescript
const styles = StyleSheet.create({
  // Team section with tally at bottom
  teamSide: {
    flex: 1,
    justifyContent: 'space-between', // Changed from 'center'
    alignItems: 'center',
    padding: 20,
  },
  tallyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  // Middle controls area
  middleControls: {
    position: 'absolute',
    left: '50%',
    top: '45%', // Positioned above current reset button
    transform: [{ translateX: -75 }, { translateY: -40 }],
    alignItems: 'center',
    width: 150,
  },

  // Unobtrusive control styling
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  teamControls: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  controlButton: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    minWidth: 24,
    minHeight: 24,
    textAlign: 'center',
  },
});
```

## 6. Testing Strategy

### 6.1 Test Structure
```
__tests__/
├── unit/
│   ├── components/
│   │   ├── TeamWinsTally.test.tsx
│   │   ├── TallyControls.test.tsx
│   │   ├── TotalGameCounter.test.tsx
│   │   └── GameScreen.test.tsx (updated)
│   └── store/
│       └── gameSlice.test.ts (updated)
├── integration/
│   ├── tally-scoring-independence.test.tsx
│   ├── complete-tally-workflow.test.tsx
│   └── component-isolation.test.tsx
└── e2e/
    ├── multi-game-session.test.js
    └── tally-persistence.test.js
```

### 6.2 Key Test Scenarios

#### Unit Tests
- Component rendering with various win counts
- Redux action dispatching and state updates
- Total game counter calculation logic
- Touch target accessibility

#### Integration Tests
- Tally updates without affecting scores
- Score resets preserving tally values
- Component independence verification
- Complete user workflow testing

#### E2E Tests
- Multi-game session scenarios
- Cross-platform consistency
- Performance impact assessment

## 7. Definition of Done

A feature is considered complete when:

### Code Quality
- [ ] All tests pass (unit, integration, e2e)
- [ ] 100% code coverage maintained
- [ ] No TypeScript errors
- [ ] ESLint passes with 0 warnings
- [ ] Code reviewed

### Functionality
- [ ] Tally displays at bottom of team sections
- [ ] Unobtrusive controls in middle of screen
- [ ] Total game counter above reset button
- [ ] Correct calculation: team1Wins + team2Wins + 1
- [ ] Tallies persist across game resets
- [ ] Component independence verified

### User Experience
- [ ] Intuitive tally control interaction
- [ ] Clear visual distinction from scoring area
- [ ] Appropriate touch targets for mobile
- [ ] Smooth animations and feedback
- [ ] Cross-platform compatibility

## 8. Acceptance Criteria

### 8.1 Core Functionality
- ✅ Game wins tally displayed at bottom of each team
- ✅ Increment/decrement controls in middle screen area
- ✅ Total game counter shows sum + 1 formula
- ✅ Tallies remain when scores are reset
- ✅ Cannot decrement below 0
- ✅ Component isolation maintained

### 8.2 Visual Design
- ✅ Unobtrusive control design
- ✅ Clear positioning above reset button
- ✅ Consistent styling with app theme
- ✅ Appropriate visual hierarchy
- ✅ Mobile-friendly touch targets

### 8.3 Technical Requirements
- ✅ Redux state management integration
- ✅ Component independence verified
- ✅ No performance impact on existing features
- ✅ TypeScript type safety maintained
- ✅ Cross-platform compatibility

## 9. Implementation Notes

### 9.1 Component Independence Strategy
- Keep tally components separate from scoring components
- Use Redux for state management to avoid prop drilling
- Design components to be easily removable if needed
- Ensure scoring functionality works without tally components

### 9.2 Layout Considerations
- Adjust team section layout from center to space-between
- Position middle controls carefully to avoid interference
- Ensure reset button remains easily accessible
- Maintain visual balance with new elements

### 9.3 State Management
- Extend existing gameSlice rather than create new slice
- Ensure score reset actions don't affect tally state
- Add separate tally reset action for complete game series reset
- Maintain backward compatibility with existing state

## 10. Risk Mitigation

### 10.1 Technical Risks
- **Layout disruption**: Mitigated by careful CSS positioning and testing
- **Component coupling**: Addressed through Redux-based state management
- **Performance impact**: Prevented through isolated component updates

### 10.2 User Experience Risks
- **Control confusion**: Solved through clear visual design and positioning
- **Accidental tally changes**: Prevented with appropriate control sizing
- **Visual clutter**: Addressed through unobtrusive design approach

### 10.3 Implementation Risks
- **Existing feature regression**: Prevented through comprehensive testing
- **State management complexity**: Mitigated through simple action design
- **Cross-platform inconsistencies**: Caught through multi-platform testing

---

*This specification provides a complete roadmap for implementing game wins tally tracking using Test-Driven Development practices, ensuring seamless integration with the existing ScoreKeep application while maintaining component independence and user experience quality.*