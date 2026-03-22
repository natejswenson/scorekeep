import Foundation
import Observation
import UIKit

enum TeamSide {
    case team1, team2
}

struct ResetSnapshot {
    let team1Score: Int
    let team2Score: Int
    let team1GamesWon: Int
    let team2GamesWon: Int
    let completedSets: [SetResult]
}

@Observable
final class GameViewModel {

    // MARK: - Active Sport

    var activeSport: Sport = .volleyball

    // MARK: - Current Game State (shared across sports)

    var team1Name: String = "Team 1"
    var team2Name: String = "Team 2"
    var team1Score: Int = 0
    var team2Score: Int = 0

    // Volleyball only
    var team1GamesWon: Int = 0
    var team2GamesWon: Int = 0
    var completedSets: [SetResult] = []
    var sessionId: UUID = UUID()
    var startedAt: Date = Date()

    // Non-volleyball per-team undo stack (push on score, pop on undo)
    var team1ActionStack: [Int] = []
    var team2ActionStack: [Int] = []

    // In-memory undo for volleyball set reset
    private(set) var lastResetSnapshot: ResetSnapshot? = nil

    // MARK: - Per-Sport History

    var volleyballHistory: [GameSession] = []
    var footballHistory: [GameSession] = []
    var basketballHistory: [GameSession] = []
    var soccerHistory: [GameSession] = []

    var currentHistory: [GameSession] {
        switch activeSport {
        case .volleyball: return volleyballHistory
        case .football:   return footballHistory
        case .basketball: return basketballHistory
        case .soccer:     return soccerHistory
        }
    }

    // Backward-compat alias used by HistoryView
    var gameHistory: [GameSession] { currentHistory }

    var hasNonZeroScore: Bool { team1Score > 0 || team2Score > 0 }
    var team1CanUndo: Bool { !team1ActionStack.isEmpty }
    var team2CanUndo: Bool { !team2ActionStack.isEmpty }

    // Debounce for tap-anywhere sports (volleyball, soccer)
    private var lastTapTime: [Int: Date] = [:]   // 1 = team1, 2 = team2
    private let tapDebounceInterval: TimeInterval = 0.2

    private let persistence = PersistenceService.shared

    // MARK: - Init

    init() {
        volleyballHistory = persistence.loadHistory(sport: .volleyball)
        footballHistory   = persistence.loadHistory(sport: .football)
        basketballHistory = persistence.loadHistory(sport: .basketball)
        soccerHistory     = persistence.loadHistory(sport: .soccer)

        activeSport = persistence.loadActiveSport()
        loadSportState(activeSport)
    }

    // MARK: - Sport Switching

    func switchSport(_ sport: Sport) {
        guard sport != activeSport else { return }
        saveCurrentSportState()     // persist old state first

        activeSport = sport
        team1ActionStack = []
        team2ActionStack = []
        lastResetSnapshot = nil

        loadSportState(sport)

        // Switching resets scores to 0 (confirmed by dialog)
        team1Score = 0
        team2Score = 0
        if sport == .volleyball {
            team1GamesWon = 0
            team2GamesWon = 0
            completedSets = []
        }

        persistence.saveActiveSport(sport)
        saveCurrentSportState()
    }

    private func loadSportState(_ sport: Sport) {
        guard let saved = persistence.loadActiveGame(sport: sport) else {
            team1Name = "Team 1"
            team2Name = "Team 2"
            team1Score = 0
            team2Score = 0
            team1ActionStack = []
            team2ActionStack = []
            if sport == .volleyball {
                team1GamesWon = 0
                team2GamesWon = 0
                completedSets = []
                sessionId = UUID()
                startedAt = Date()
            }
            return
        }

        team1Name       = saved.team1Name
        team2Name       = saved.team2Name
        team1Score      = saved.team1Score
        team2Score      = saved.team2Score
        team1ActionStack = saved.team1ActionStack
        team2ActionStack = saved.team2ActionStack

        if sport == .volleyball {
            team1GamesWon = saved.team1GamesWon
            team2GamesWon = saved.team2GamesWon
            completedSets = saved.sets
            sessionId     = saved.sessionId
            startedAt     = saved.startedAt
        } else {
            startedAt = saved.startedAt
        }
    }

    // MARK: - Score Actions

    /// Tap-anywhere increment for volleyball and soccer (debounced).
    func incrementScore(team: TeamSide) {
        let key = team == .team1 ? 1 : 2
        let now = Date()
        if let last = lastTapTime[key], now.timeIntervalSince(last) < tapDebounceInterval { return }
        lastTapTime[key] = now
        addScore(team: team, points: 1)
    }

    /// Long-press decrement for volleyball and soccer.
    func decrementScore(team: TeamSide) {
        switch team {
        case .team1:
            guard team1Score > 0 else { return }
            team1Score -= 1
            team1ActionStack = []
        case .team2:
            guard team2Score > 0 else { return }
            team2Score -= 1
            team2ActionStack = []
        }
        saveCurrentSportState()
    }

    /// Button-based scoring for football and basketball. Pushes onto the undo stack.
    func addScore(team: TeamSide, points: Int) {
        switch team {
        case .team1:
            team1Score += points
            team1ActionStack.append(points)
        case .team2:
            team2Score += points
            team2ActionStack.append(points)
        }
        saveCurrentSportState()
    }

    /// Undo the most recent button action (pops from the team's undo stack).
    func undoLastAction(team: TeamSide) {
        switch team {
        case .team1:
            guard let action = team1ActionStack.popLast() else { return }
            team1Score = max(0, team1Score - action)
        case .team2:
            guard let action = team2ActionStack.popLast() else { return }
            team2Score = max(0, team2Score - action)
        }
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        saveCurrentSportState()
    }

    // MARK: - Reset

    /// Routes to the correct reset handler for the current sport.
    func handleReset() {
        if activeSport == .volleyball {
            resetSet()
        } else {
            resetGame()
        }
    }

    /// Volleyball: end a set, track games won, snapshot for undo.
    func resetSet() {
        lastResetSnapshot = ResetSnapshot(
            team1Score: team1Score,
            team2Score: team2Score,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            completedSets: completedSets
        )

        let set = SetResult(team1Score: team1Score, team2Score: team2Score, completedAt: Date())
        completedSets.append(set)

        if team1Score > team2Score { team1GamesWon += 1 }
        else if team2Score > team1Score { team2GamesWon += 1 }

        team1Score = 0
        team2Score = 0
        saveCurrentSportState()
    }

    /// Non-volleyball: end game, save to sport history, clear scores.
    func resetGame() {
        let session = GameSession(
            sport: activeSport,
            team1Name: team1Name,
            team2Name: team2Name,
            team1FinalScore: team1Score,
            team2FinalScore: team2Score,
            startedAt: startedAt,
            endedAt: Date()
        )
        appendToCurrentHistory(session)

        team1Score = 0
        team2Score = 0
        team1ActionStack = []
        team2ActionStack = []
        startedAt = Date()
        saveCurrentSportState()
    }

    /// Undo a volleyball set reset.
    func undoReset() {
        guard let snap = lastResetSnapshot else { return }
        team1Score    = snap.team1Score
        team2Score    = snap.team2Score
        team1GamesWon = snap.team1GamesWon
        team2GamesWon = snap.team2GamesWon
        completedSets = snap.completedSets
        lastResetSnapshot = nil
        saveCurrentSportState()
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }

    func clearResetSnapshot() {
        lastResetSnapshot = nil
    }

    // MARK: - Team Names

    func updateTeamName(_ name: String, team: TeamSide) {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        switch team {
        case .team1: team1Name = trimmed
        case .team2: team2Name = trimmed
        }
        saveCurrentSportState()
    }

    // MARK: - History Management

    /// Archive current volleyball session and start fresh (called from HistoryView).
    func startNewGame() {
        let session = GameSession(
            id: sessionId,
            sport: .volleyball,
            team1Name: team1Name,
            team2Name: team2Name,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            sets: completedSets,
            startedAt: startedAt,
            endedAt: Date()
        )
        appendToCurrentHistory(session)

        team1Score = 0
        team2Score = 0
        team1GamesWon = 0
        team2GamesWon = 0
        completedSets = []
        lastResetSnapshot = nil
        sessionId = UUID()
        startedAt = Date()
        saveCurrentSportState()
    }

    func deleteHistorySession(id: UUID) {
        switch activeSport {
        case .volleyball:
            volleyballHistory.removeAll { $0.id == id }
            persistence.saveHistory(volleyballHistory, sport: .volleyball)
        case .football:
            footballHistory.removeAll { $0.id == id }
            persistence.saveHistory(footballHistory, sport: .football)
        case .basketball:
            basketballHistory.removeAll { $0.id == id }
            persistence.saveHistory(basketballHistory, sport: .basketball)
        case .soccer:
            soccerHistory.removeAll { $0.id == id }
            persistence.saveHistory(soccerHistory, sport: .soccer)
        }
    }

    func clearAllHistory() {
        switch activeSport {
        case .volleyball:
            volleyballHistory = []
            persistence.saveHistory([], sport: .volleyball)
        case .football:
            footballHistory = []
            persistence.saveHistory([], sport: .football)
        case .basketball:
            basketballHistory = []
            persistence.saveHistory([], sport: .basketball)
        case .soccer:
            soccerHistory = []
            persistence.saveHistory([], sport: .soccer)
        }
    }

    // MARK: - Private Helpers

    private func appendToCurrentHistory(_ session: GameSession) {
        switch activeSport {
        case .volleyball:
            persistence.appendSession(session, sport: .volleyball, to: &volleyballHistory)
        case .football:
            persistence.appendSession(session, sport: .football, to: &footballHistory)
        case .basketball:
            persistence.appendSession(session, sport: .basketball, to: &basketballHistory)
        case .soccer:
            persistence.appendSession(session, sport: .soccer, to: &soccerHistory)
        }
    }

    private func saveCurrentSportState() {
        let active = ActiveGame(
            sport: activeSport,
            team1Name: team1Name,
            team2Name: team2Name,
            team1Score: team1Score,
            team2Score: team2Score,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            team1ActionStack: team1ActionStack,
            team2ActionStack: team2ActionStack,
            sets: completedSets,
            sessionId: sessionId,
            startedAt: startedAt
        )
        persistence.saveActiveGame(active)
    }
}
