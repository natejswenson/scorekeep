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
    var team1Name: String = "Team 1"
    var team2Name: String = "Team 2"
    var team1Score: Int = 0
    var team2Score: Int = 0
    var team1GamesWon: Int = 0
    var team2GamesWon: Int = 0
    var completedSets: [SetResult] = []
    var sessionId: UUID = UUID()
    var startedAt: Date = Date()
    var gameHistory: [GameSession] = []

    // In-memory only — not persisted across restarts
    private(set) var lastResetSnapshot: ResetSnapshot? = nil

    // Debounce
    private var lastTapTime: [TeamSide: Date] = [:]
    private let tapDebounceInterval: TimeInterval = 0.2

    private let persistence = PersistenceService.shared

    init() {
        gameHistory = persistence.loadHistory()
        if let saved = persistence.loadActiveGame() {
            team1Name = saved.team1Name
            team2Name = saved.team2Name
            team1Score = saved.team1Score
            team2Score = saved.team2Score
            team1GamesWon = saved.team1GamesWon
            team2GamesWon = saved.team2GamesWon
            completedSets = saved.sets
            sessionId = saved.sessionId
            startedAt = saved.startedAt
        }
    }

    // MARK: - Score Actions

    func incrementScore(team: TeamSide) {
        let now = Date()
        if let last = lastTapTime[team], now.timeIntervalSince(last) < tapDebounceInterval {
            return
        }
        lastTapTime[team] = now
        switch team {
        case .team1: team1Score += 1
        case .team2: team2Score += 1
        }
        saveActiveGame()
    }

    func decrementScore(team: TeamSide) {
        switch team {
        case .team1:
            guard team1Score > 0 else { return }
            team1Score -= 1
        case .team2:
            guard team2Score > 0 else { return }
            team2Score -= 1
        }
        saveActiveGame()
    }

    // MARK: - Reset Set

    func resetSet() {
        // Snapshot full state BEFORE modifying anything
        lastResetSnapshot = ResetSnapshot(
            team1Score: team1Score,
            team2Score: team2Score,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            completedSets: completedSets
        )

        let set = SetResult(team1Score: team1Score, team2Score: team2Score, completedAt: Date())
        completedSets.append(set)

        if team1Score > team2Score {
            team1GamesWon += 1
        } else if team2Score > team1Score {
            team2GamesWon += 1
        }

        team1Score = 0
        team2Score = 0
        saveActiveGame()
    }

    func undoReset() {
        guard let snap = lastResetSnapshot else { return }
        team1Score = snap.team1Score
        team2Score = snap.team2Score
        team1GamesWon = snap.team1GamesWon
        team2GamesWon = snap.team2GamesWon
        completedSets = snap.completedSets
        lastResetSnapshot = nil
        saveActiveGame()
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
        saveActiveGame()
    }

    // MARK: - New Game

    func startNewGame() {
        let session = GameSession(
            id: sessionId,
            team1Name: team1Name,
            team2Name: team2Name,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            sets: completedSets,
            startedAt: startedAt,
            endedAt: Date()
        )
        persistence.appendSession(session, to: &gameHistory)

        team1Score = 0
        team2Score = 0
        team1GamesWon = 0
        team2GamesWon = 0
        completedSets = []
        lastResetSnapshot = nil
        sessionId = UUID()
        startedAt = Date()
        saveActiveGame()
    }

    // MARK: - History Management

    func deleteHistorySession(id: UUID) {
        gameHistory.removeAll { $0.id == id }
        persistence.saveHistory(gameHistory)
    }

    func clearAllHistory() {
        gameHistory = []
        persistence.saveHistory(gameHistory)
    }

    // MARK: - Private Persistence

    private func saveActiveGame() {
        let active = ActiveGame(
            team1Name: team1Name,
            team2Name: team2Name,
            team1Score: team1Score,
            team2Score: team2Score,
            team1GamesWon: team1GamesWon,
            team2GamesWon: team2GamesWon,
            sets: completedSets,
            sessionId: sessionId,
            startedAt: startedAt
        )
        persistence.saveActiveGame(active)
    }
}
