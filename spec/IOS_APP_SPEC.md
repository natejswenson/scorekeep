# ScoreKeep iOS App — Specification

**Version:** 1.0
**Date:** 2026-03-21
**Target Platform:** iOS (Swift / SwiftUI)
**Primary Use Case:** Volleyball scorekeeping

---

## 1. Purpose & Context

ScoreKeep iOS is a minimalist, native iOS scorekeeping app designed primarily for volleyball. It provides a distraction-free, glanceable scoreboard that works reliably in noisy gym environments where users need to quickly tap a score without fumbling through menus.

The app is NOT a stats tracker, analytics platform, or coaching tool. It is a fast, beautiful scoreboard with a persistent game history.

---

## 2. Scope

### In Scope
- Two-team scoreboard (current set scores)
- Games-won tally per team per game session
- Tap/long-press gesture scoring
- Team name entry (required for history)
- Full game history (stored locally)
- Portrait and landscape layout support
- Dark mode minimalist theme
- Haptic feedback on score change
- Reset current set scores (preserve games-won)

### Out of Scope
- Sound effects
- Volleyball rule enforcement (no win condition logic, no set auto-detection)
- Server indicator
- Game timer
- Cloud sync or account system
- Notifications
- Apple Watch companion
- iPad-specific layout (treat as large iPhone)

---

## 3. Design & Theme

### 3.1 Color Palette

| Token            | Value       | Usage                              |
|------------------|-------------|------------------------------------|
| `background`     | `#111111`   | App background                     |
| `surface`        | `#1C1C1E`   | Cards, modals, history rows        |
| `surfaceAlt`     | `#2C2C2E`   | Dividers, secondary surfaces       |
| `team1`          | `#1E1E1E`   | Top half background (Team 1)       |
| `team2`          | `#161616`   | Bottom half background (Team 2)    |
| `scoreText`      | `#FFFFFF`   | Score digits                       |
| `teamNameText`   | `#8E8E93`   | Team name label (subtle)           |
| `gamesWonText`   | `#FFFFFF`   | Games-won count                    |
| `gamesWonLabel`  | `#636366`   | "GAMES WON" label                  |
| `resetButton`    | `#2C2C2E`   | Reset button background            |
| `resetIcon`      | `#AEAEB2`   | Reset icon color                   |
| `separator`      | `#3A3A3C`   | Hairline between teams             |
| `tapFeedback`    | `#FFFFFF0A` | Momentary flash on tap             |

> **Rule:** Do NOT use bright primary colors (red, blue) anywhere. The two team sides are distinguished only by very subtle background value differences (`#1E1E1E` vs `#161616`). All contrast comes from white text on dark backgrounds.

### 3.2 Typography

| Role             | Font                        | Size (pt) | Weight    |
|------------------|-----------------------------|-----------|-----------|
| Score            | SF Pro Display (or system)  | 160       | Ultralight |
| Team Name        | SF Pro Text                 | 15        | Regular   |
| Games Won Count  | SF Pro Display              | 28        | Thin      |
| Games Won Label  | SF Pro Text                 | 10        | Medium    |
| History Title    | SF Pro Display              | 22        | Semibold  |
| History Row      | SF Pro Text                 | 15        | Regular   |

> The score is the visual hero of every screen. It must dominate. Nothing should compete with it.

### 3.3 Reset Button Design

- Shape: Circle, 56pt diameter
- Background: `#2C2C2E` (surfaceAlt)
- Icon: SF Symbol `arrow.counterclockwise`, 20pt, color `#AEAEB2`
- Border: 1pt stroke `#3A3A3C`
- Shadow: `0 2 8 #00000066`
- Pressed state: scale to 0.92, background `#3A3A3C`, with medium haptic
- Positioned exactly at the boundary between the two team halves (centered on the divider line)

---

## 4. Layout

### 4.1 Portrait Mode

```
┌─────────────────────────────────┐
│                                 │
│   Team 1 Name (subtle, center)  │  ← 15pt, #8E8E93
│                                 │
│               0                 │  ← Score, 160pt ultralight, white
│                                 │
│        GAMES WON                │  ← 10pt, #636366
│             0                   │  ← 28pt thin, white
│                                 │
│ ─ ─ ─ ─ ─ ─ ⟳ ─ ─ ─ ─ ─ ─ ─  │  ← Reset button centered on divider
│                                 │
│               0                 │  ← Score, 160pt ultralight, white
│                                 │
│        GAMES WON                │
│             0                   │
│                                 │
│   Team 2 Name (subtle, center)  │
│                                 │
└─────────────────────────────────┘
```

- Two halves split 50/50 vertically
- Score vertically centered in each half, offset slightly toward top (to account for games-won row below)
- Team name appears near the outer edge of each half (top of Team 1 half, bottom of Team 2 half)
- Games-won sits just below the score in each half
- Reset button sits centered on the horizontal divider line

### 4.2 Landscape Mode

```
┌────────────────┬──────────────────┐
│                │ ⟳                │
│  Team 1 Name   │    Team 2 Name   │
│                │                  │
│      0         │        0         │
│                │                  │
│  GAMES WON  0  │  GAMES WON  0   │
│                │                  │
└────────────────┴──────────────────┘
```

- Two halves split 50/50 horizontally
- Reset button centered on the vertical divider
- Score is the dominant element in each half
- Team name appears at the top of each half
- Games-won sits near the bottom of each half

### 4.3 Layout Rules

- The entire half is a tap target (no small button to hit)
- No navigation bar, no tab bar, no status bar chrome during active scoring (use `.ignoresSafeArea` and hide status bar)
- Safe area insets respected for the outer edges only
- Orientation changes animate smoothly (no abrupt jumps)

---

## 5. Core Interactions

### 5.1 Score Increment (Tap)

- **Trigger:** Single tap anywhere inside a team's half
- **Action:** Increment that team's score by 1
- **Feedback:**
  - Haptic: `UIImpactFeedbackGenerator(style: .light).impactOccurred()`
  - Visual: Brief white flash overlay (`#FFFFFF0A`) fades in/out over 120ms
- **Animation:** Score number scales from 0.85 → 1.0 over 180ms with spring easing

### 5.2 Score Decrement (Long Press)

- **Trigger:** Long press (≥ 0.4 seconds) anywhere inside a team's half
- **Action:** Decrement that team's score by 1 (minimum 0; never go below 0)
- **Feedback:**
  - Haptic: `UIImpactFeedbackGenerator(style: .medium).impactOccurred()`
  - Visual: Brief red-tinted overlay (`#FF3B300A`) fades in/out over 120ms
- **Animation:** Score number scales from 1.1 → 1.0 over 180ms
- **Guard:** If score is already 0, do nothing (no haptic, no animation)

### 5.3 Reset (Tap Reset Button)

- **Trigger:** Tap the center reset button
- **Action:**
  1. Reset Team 1 score to 0
  2. Reset Team 2 score to 0
  3. Increment games-won for whichever team had the higher score (if scores are tied, increment neither)
  4. Persist updated games-won count
- **Feedback:**
  - Haptic: `UINotificationFeedbackGenerator().notificationOccurred(.warning)`
  - Visual: Button scales to 0.92, then springs back
- **NO confirmation dialog** for set reset
- Games-won tally is NOT cleared by this action

### 5.4 Edit Team Name

- **Trigger:** Tap directly on the team name label
- **Presentation:** Bottom sheet (`.sheet`) with a single `TextField` pre-filled with current name, keyboard shown immediately
- **Validation:**
  - Max 20 characters
  - Min 1 character (non-empty after trimming)
  - No special validation beyond length
- **Confirmation:** "Done" button on sheet dismisses and saves; swipe-down dismisses without saving
- **Default names:** "Team 1" and "Team 2" (used if user never edits)

---

## 6. Game Session & History

### 6.1 Game Session Lifecycle

A **game session** begins when the user starts the app (or starts a new game from history screen). It ends when:
- The user explicitly taps "New Game" from the history screen
- OR the app is launched fresh with no saved state

A game session tracks:
- Team 1 name and Team 2 name
- Games-won count for each team (updated on each set reset)
- Start timestamp
- End timestamp (set when "New Game" is tapped)
- Each set result (score at time of reset)

### 6.2 State Persistence

- Current game session state is saved to `UserDefaults` (or a simple JSON file in app documents) after **every** score change and reset
- This includes: team names, current scores, games-won tallies, set history within current session
- On app launch, restore this state — the user returns to exactly where they left off

### 6.3 History Screen

- **Trigger:** Swipe up from bottom of main screen (or dedicated "History" icon — a small clock icon at the very top of screen, 20pt, color `#636366`)
- **Presentation:** Full-screen sheet sliding up from bottom
- **Contents:**
  - List of past completed game sessions
  - Each row shows: Team 1 Name vs Team 2 Name, games-won result (e.g., 3–2), date
  - Most recent at top
  - Tapping a row expands to show individual set scores
- **Max stored:** 50 game sessions (oldest deleted when limit exceeded — FIFO)
- **Delete:** Swipe-to-delete on individual rows; "Clear All" button at top right (with confirmation)
- **Current game:** NOT shown in history until it ends (i.e., until "New Game" is tapped)

### 6.4 New Game Flow

- "New Game" button appears inside the history screen (prominent, near top)
- Tapping it:
  1. Finalizes and saves the current game session to history
  2. Resets all state: scores → 0, games-won → 0
  3. Dismisses history screen, returns to main scoreboard
  4. Team names are preserved (user doesn't have to re-enter)

### 6.5 Data Model

```swift
struct GameSession: Codable, Identifiable {
    let id: UUID
    var team1Name: String
    var team2Name: String
    var team1GamesWon: Int
    var team2GamesWon: Int
    var sets: [SetResult]
    var startedAt: Date
    var endedAt: Date?
}

struct SetResult: Codable {
    var team1Score: Int
    var team2Score: Int
    var completedAt: Date
}

struct ActiveGame: Codable {
    var team1Name: String       // default: "Team 1"
    var team2Name: String       // default: "Team 2"
    var team1Score: Int         // current set score
    var team2Score: Int         // current set score
    var team1GamesWon: Int
    var team2GamesWon: Int
    var sets: [SetResult]       // completed sets in current session
    var sessionId: UUID
    var startedAt: Date
}
```

---

## 7. App Architecture

### 7.1 Tech Stack

- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Minimum iOS:** iOS 17
- **State management:** `@Observable` macro (iOS 17 observation framework) — do NOT use `ObservableObject`/`@StateObject` (deprecated pattern)
- **Persistence:** `UserDefaults` for `ActiveGame`; `FileManager` + JSON for `[GameSession]` history array
- **No third-party dependencies**

### 7.2 File Structure

```
ScoreKeep/
├── ScoreKeepApp.swift          # App entry point
├── Models/
│   ├── GameSession.swift       # GameSession, SetResult structs
│   └── ActiveGame.swift        # ActiveGame struct
├── ViewModels/
│   └── GameViewModel.swift     # @Observable class, all game logic
├── Views/
│   ├── MainGameView.swift      # Root view, orientation-aware
│   ├── PortraitLayout.swift    # Portrait scoreboard layout
│   ├── LandscapeLayout.swift   # Landscape scoreboard layout
│   ├── TeamHalfView.swift      # Reusable team half (tap/long-press target)
│   ├── ResetButton.swift       # Animated center reset button
│   ├── TeamNameEditSheet.swift # Bottom sheet for name editing
│   └── HistoryView.swift       # Game history list
├── Services/
│   └── PersistenceService.swift # Read/write active game + history
└── Resources/
    └── Assets.xcassets
```

### 7.3 GameViewModel Responsibilities

```swift
@Observable
class GameViewModel {
    // State
    var team1Name: String
    var team2Name: String
    var team1Score: Int
    var team2Score: Int
    var team1GamesWon: Int
    var team2GamesWon: Int
    var completedSets: [SetResult]
    var sessionId: UUID
    var startedAt: Date
    var gameHistory: [GameSession]

    // Actions
    func incrementScore(team: TeamSide)        // tap handler
    func decrementScore(team: TeamSide)        // long-press handler
    func resetSet()                            // reset button
    func updateTeamName(_ name: String, team: TeamSide)
    func startNewGame()                        // from history screen
    func deleteHistorySession(id: UUID)
    func clearAllHistory()

    // Private
    private func saveActiveGame()
    private func loadActiveGame()
    private func saveHistory()
    private func loadHistory()
}

enum TeamSide { case team1, team2 }
```

---

## 8. Gesture Handling

### 8.1 Tap vs Long Press Disambiguation

Use SwiftUI's `simultaneousGesture` with `TapGesture` and `LongPressGesture`:

```swift
TeamHalfView()
    .simultaneousGesture(
        LongPressGesture(minimumDuration: 0.4)
            .onEnded { _ in viewModel.decrementScore(team: side) }
    )
    .simultaneousGesture(
        TapGesture()
            .onEnded { viewModel.incrementScore(team: side) }
    )
```

> **Important:** Do NOT use `.onTapGesture` and `.onLongPressGesture` together — use `simultaneousGesture` to avoid gesture conflicts.

### 8.2 Preventing Accidental Taps

- Implement a 200ms debounce on tap: if two taps arrive within 200ms, only process the first
- This prevents accidental double-increments during fumbled taps

---

## 9. Haptics Implementation

```swift
// On score increment
let light = UIImpactFeedbackGenerator(style: .light)
light.prepare()
light.impactOccurred()

// On score decrement
let medium = UIImpactFeedbackGenerator(style: .medium)
medium.prepare()
medium.impactOccurred()

// On reset
let notify = UINotificationFeedbackGenerator()
notify.prepare()
notify.notificationOccurred(.warning)

// On team name saved
let selection = UISelectionFeedbackGenerator()
selection.prepare()
selection.selectionChanged()
```

> Always call `.prepare()` before the triggering action to minimize latency.

---

## 10. Orientation Support

- Use `GeometryReader` + `UIDevice.current.orientation` or environment's `horizontalSizeClass` to detect orientation
- Switch between `PortraitLayout` and `LandscapeLayout` views
- Animate the transition: `.animation(.easeInOut(duration: 0.3), value: isLandscape)`
- Lock to portrait and landscape — allow all orientations except upside-down portrait
- Do NOT support upside-down portrait (`.supportedInterfaceOrientations = [.portrait, .landscapeLeft, .landscapeRight]`)

---

## 11. Constraints & Rules

### Always Do
- Clamp score minimum at 0 — never negative
- Save state after every single user action (score change, reset, name edit)
- Restore state on every app launch
- Use SF Symbols for all icons (no custom icon assets needed)
- Support Dynamic Type for team name and label text (score can be fixed size)
- Respect `.preferredColorScheme(.dark)` — force dark mode regardless of system setting (the dark theme IS the app)

### Never Do
- Never show an alert/confirmation for a set reset
- Never enforce a score cap or win condition
- Never play audio
- Never use `UIKit` views directly (use SwiftUI representable only if truly necessary for haptics, which must go through `UIImpactFeedbackGenerator`)
- Never use third-party packages
- Never store data in iCloud or send network requests
- Never show ads, onboarding flows, or paywalls
- Never put buttons other than reset on the main scoring screen (history is accessed via swipe or icon, names via tap on label)

---

## 12. Edge Cases

| Scenario | Behavior |
|---|---|
| Score at 0, user long-presses | Do nothing. No haptic. No animation. |
| Reset with tied scores (both same) | Increment neither team's games-won count. Still reset scores to 0. |
| User edits team name to empty string | Reject — keep existing name. Show inline validation message in sheet. |
| App backgrounded mid-game | State already saved — no action needed on background. |
| History has 50 entries, new game ends | Delete oldest entry, add new one. |
| Device orientation changes during score animation | Animation completes in new layout — no crash or glitch. |
| User deletes all history | `gameHistory` becomes empty array. History screen shows empty state: "No games yet." |

---

## 13. Testing Criteria

### Unit Tests (GameViewModel)
- [ ] `incrementScore` increases score by 1
- [ ] `decrementScore` decreases score by 1
- [ ] `decrementScore` does not go below 0
- [ ] `resetSet` with team1 leading: increments team1GamesWon, not team2
- [ ] `resetSet` with team2 leading: increments team2GamesWon, not team1
- [ ] `resetSet` with tied scores: neither gamesWon incremented
- [ ] `resetSet` saves a `SetResult` to `completedSets`
- [ ] `startNewGame` saves session to history, resets all scores and tallies
- [ ] `updateTeamName` trims whitespace before saving
- [ ] History capped at 50 entries (oldest removed on 51st)

### UI Tests
- [ ] Tap top half → score increments
- [ ] Tap bottom half → score increments (correct team)
- [ ] Long press top half → score decrements
- [ ] Tap reset → both scores go to 0
- [ ] Tap team name label → sheet appears with TextField focused
- [ ] Swipe up → history screen appears
- [ ] Portrait and landscape layouts render without clipping

---

## 14. Success Criteria

The implementation is complete when:

1. A user can open the app, see a clean dark scoreboard, and immediately tap to score without any onboarding or setup
2. Long press correctly subtracts (never below 0)
3. Reset clears set scores and correctly increments games-won for the winning team
4. Team names can be edited by tapping the name label; names persist across app restarts
5. Game history is accessible via swipe-up and shows completed sessions with set details
6. "New Game" finalizes and archives the current session, then resets the board
7. The app restores exactly to its previous state after being force-quit and relaunched
8. The layout is correct and usable in both portrait and landscape on all iPhone sizes (SE through Pro Max)
9. Haptic feedback fires on every score change and reset
10. No third-party dependencies, no network calls, no audio
