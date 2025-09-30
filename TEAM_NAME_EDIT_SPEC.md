# Team Name Edit Feature - TDD Specification

## Overview
Add inline editing capability for team names in the ScoreKeep volleyball app, allowing users to customize team names without affecting scoring functionality or game state.

## 1. Requirements

### 1.1 Functional Requirements

#### Core Editing Features
- **F1**: Display small edit icon next to each team name (Team 1, Team 2)
- **F2**: Click edit icon to enter edit mode for that specific team
- **F3**: Show text input field when in edit mode
- **F4**: Save team name changes on input blur or Enter key
- **F5**: Cancel editing on Escape key press
- **F6**: Preserve team name changes during score operations
- **F7**: Maintain team name persistence across app sessions

#### Input Validation
- **F8**: Limit team name length to reasonable maximum (e.g., 20 characters)
- **F9**: Trim whitespace from team name input
- **F10**: Prevent empty team names (revert to previous name)
- **F11**: Handle special characters appropriately

#### Visual Feedback
- **F12**: Show visual indication when in edit mode
- **F13**: Display edit icon only on hover/focus (desktop) or always visible (mobile)
- **F14**: Smooth transition between display and edit modes

### 1.2 Non-Functional Requirements

#### Usability
- **NF1**: Edit icon must be easily tappable (minimum 24px touch target)
- **NF2**: Text input should be clearly visible with good contrast
- **NF3**: Edit mode should not interfere with score buttons
- **NF4**: Intuitive interaction flow requiring no instructions

#### Performance
- **NF5**: Instant visual feedback when entering edit mode
- **NF6**: Smooth animations for mode transitions (< 200ms)
- **NF7**: No impact on score update performance

#### Technical
- **NF8**: Maintain Redux state management pattern
- **NF9**: Preserve existing TypeScript type safety
- **NF10**: Cross-platform compatibility (iOS, Android, Web)

## 2. TDD Plan & Test Categories

### 2.1 Red-Green-Refactor Cycle

Each feature will follow strict TDD methodology:
1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

### 2.2 Test Categories

#### Unit Tests
- Component rendering with edit icons
- Edit mode state transitions
- Input validation logic
- Redux action creators and reducers
- Text input event handlers

#### Integration Tests
- Complete edit workflow (click → edit → save)
- Redux store integration
- Component state synchronization
- Cross-team editing independence

#### End-to-End Tests
- User interaction flow
- Persistence across sessions
- Cross-platform behavior

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
  // New editing state
  editingTeam: 'team1' | 'team2' | null;
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
setEditingTeam: (state, action: PayloadAction<'team1' | 'team2' | null>) => {
  state.editingTeam = action.payload;
},
updateTeamName: (state, action: PayloadAction<{ team: 'team1' | 'team2', name: string }>) => {
  const { team, name } = action.payload;
  const trimmedName = name.trim();
  if (trimmedName.length > 0 && trimmedName.length <= 20) {
    state[team].name = trimmedName;
  }
  state.editingTeam = null;
},
```

### 3.3 Component Architecture

```typescript
// New component structure
GameScreen
├── TeamSide (enhanced)
│   ├── TeamNameDisplay (new)
│   │   ├── TeamNameText
│   │   ├── EditIcon
│   │   └── TeamNameInput (conditional)
│   ├── ScoreArea (existing)
│   └── DecrementButton (existing)
└── ResetButton (existing)
```

## 4. Implementation Phases

### Phase 1: Basic Edit Mode (Week 1)
**Goal**: Click to edit functionality with visual feedback

#### Tests to Write:
```javascript
describe('Team Name Edit Mode', () => {
  test('should display edit icon next to team name');
  test('should enter edit mode when edit icon clicked');
  test('should show text input in edit mode');
  test('should hide edit icon when in edit mode');
  test('should exit edit mode on blur');
  test('should only allow editing one team at a time');
});
```

#### Components to Create:
- `TeamNameDisplay` component
- Edit mode state management
- Basic edit/display mode switching

### Phase 2: Input Handling & Validation (Week 2)
**Goal**: Robust input handling with validation

#### Tests to Write:
```javascript
describe('Team Name Input Validation', () => {
  test('should save team name on Enter key');
  test('should cancel edit on Escape key');
  test('should trim whitespace from input');
  test('should reject empty names');
  test('should limit name length to 20 characters');
  test('should revert to previous name if invalid');
});
```

#### Features:
- Keyboard event handling
- Input validation logic
- Error state management

### Phase 3: Redux Integration (Week 3)
**Goal**: Proper state management and persistence

#### Tests to Write:
```javascript
describe('Team Name Redux Integration', () => {
  test('should dispatch setEditingTeam action on edit click');
  test('should dispatch updateTeamName on save');
  test('should update team name in Redux store');
  test('should preserve team names during score operations');
  test('should maintain editing state independence');
});
```

#### Features:
- Redux action integration
- State persistence
- Score operation isolation

### Phase 4: Visual Polish & Accessibility (Week 4)
**Goal**: Refined UI/UX and accessibility features

#### Tests to Write:
```javascript
describe('Team Name Edit Accessibility', () => {
  test('should provide proper aria labels');
  test('should support keyboard navigation');
  test('should have sufficient color contrast');
  test('should work with screen readers');
  test('should have appropriate touch targets');
});
```

#### Features:
- Smooth animations
- Accessibility attributes
- Mobile optimization
- Cross-platform testing

## 5. Detailed Component Design

### 5.1 TeamNameDisplay Component

```typescript
interface TeamNameDisplayProps {
  teamId: 'team1' | 'team2';
  name: string;
  color: string;
  isEditing: boolean;
  onStartEdit: (teamId: 'team1' | 'team2') => void;
  onSaveName: (teamId: 'team1' | 'team2', name: string) => void;
  onCancelEdit: () => void;
}

const TeamNameDisplay: React.FC<TeamNameDisplayProps> = ({
  teamId,
  name,
  color,
  isEditing,
  onStartEdit,
  onSaveName,
  onCancelEdit,
}) => {
  // Component implementation
};
```

### 5.2 Styling Considerations

```typescript
const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  teamNameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  editIcon: {
    marginLeft: 8,
    padding: 4,
    minWidth: 24,
    minHeight: 24,
  },
  nameInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 4,
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
│   │   ├── TeamNameDisplay.test.tsx
│   │   └── GameScreen.test.tsx
│   └── store/
│       └── gameSlice.test.ts
├── integration/
│   └── team-name-editing.test.tsx
└── e2e/
    └── team-customization.test.js
```

### 6.2 Key Test Scenarios

#### Unit Tests
- Component rendering in both display and edit modes
- Event handler functions
- Input validation functions
- Redux reducer behavior

#### Integration Tests
- Complete edit workflow
- State synchronization between components
- Multiple team editing scenarios

#### E2E Tests
- Full user interaction flow
- Cross-platform consistency
- Persistence testing

## 7. Definition of Done

A feature is considered complete when:

### Code Quality
- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage > 90% for new code
- [ ] No TypeScript errors
- [ ] ESLint passes with 0 warnings
- [ ] Code reviewed

### Functionality
- [ ] Edit icons visible and functional
- [ ] Smooth edit mode transitions
- [ ] Input validation working correctly
- [ ] Team names persist across operations
- [ ] Cross-platform compatibility verified

### User Experience
- [ ] Intuitive editing flow
- [ ] Appropriate touch targets (mobile)
- [ ] Smooth animations
- [ ] Accessibility requirements met
- [ ] No interference with existing functionality

## 8. Acceptance Criteria

### 8.1 Core Functionality
- ✅ Edit icon appears next to each team name
- ✅ Click edit icon enters edit mode for that team only
- ✅ Text input allows name customization
- ✅ Enter key or blur saves the name
- ✅ Escape key cancels editing
- ✅ Team names persist during score operations

### 8.2 User Experience
- ✅ Edit mode is visually distinct from display mode
- ✅ Only one team can be edited at a time
- ✅ Edit icon is easily tappable on mobile devices
- ✅ Smooth transitions between modes
- ✅ Clear visual feedback during editing

### 8.3 Technical Requirements
- ✅ Redux state properly manages editing state
- ✅ No impact on existing score functionality
- ✅ Input validation prevents invalid names
- ✅ TypeScript types maintained
- ✅ Cross-platform compatibility

## 9. Implementation Notes

### 9.1 Redux Pattern Consistency
- Follow existing patterns in `gameSlice.ts`
- Use Redux Toolkit's `createSlice` pattern
- Maintain immutable updates with Immer

### 9.2 Component Integration
- Integrate `TeamNameDisplay` into existing `GameScreen`
- Maintain existing styling patterns
- Preserve current layout structure

### 9.3 Mobile Considerations
- Ensure edit icons are touch-friendly
- Handle virtual keyboard behavior
- Test on various screen sizes

## 10. Risk Mitigation

### 10.1 Technical Risks
- **Layout disruption**: Mitigated by careful CSS and testing
- **State management complexity**: Addressed through isolated editing state
- **Cross-platform input differences**: Handled through comprehensive testing

### 10.2 User Experience Risks
- **Accidental edits**: Prevented by clear edit mode indication
- **Input frustration**: Addressed through proper validation and feedback
- **Feature discovery**: Solved with intuitive edit icon placement

---

*This specification provides a complete roadmap for implementing team name editing using Test-Driven Development practices, ensuring robust functionality that integrates seamlessly with the existing ScoreKeep application.*