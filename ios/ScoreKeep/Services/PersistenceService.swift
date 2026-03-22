import Foundation

final class PersistenceService {
    static let shared = PersistenceService()
    private init() {}

    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    // MARK: - Active Sport

    func saveActiveSport(_ sport: Sport) {
        UserDefaults.standard.set(sport.rawValue, forKey: "activeSport")
    }

    func loadActiveSport() -> Sport {
        guard let raw = UserDefaults.standard.string(forKey: "activeSport"),
              let sport = Sport(rawValue: raw) else {
            return .volleyball
        }
        return sport
    }

    // MARK: - Active Game (UserDefaults) — per sport

    func saveActiveGame(_ game: ActiveGame) {
        guard let data = try? encoder.encode(game) else { return }
        UserDefaults.standard.set(data, forKey: game.sport.activeGameKey)
    }

    func loadActiveGame(sport: Sport) -> ActiveGame? {
        // Try new per-sport key first
        if let data = UserDefaults.standard.data(forKey: sport.activeGameKey),
           let game = try? decoder.decode(ActiveGame.self, from: data) {
            return game
        }
        // Legacy fallback: volleyball was stored under "activeGame"
        if sport == .volleyball,
           let data = UserDefaults.standard.data(forKey: "activeGame"),
           let game = try? decoder.decode(ActiveGame.self, from: data) {
            saveActiveGame(game)  // migrate to new key
            UserDefaults.standard.removeObject(forKey: "activeGame")
            return game
        }
        return nil
    }

    // MARK: - Game History (FileManager) — per sport

    private func historyFileURL(for sport: Sport) -> URL {
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return docs.appendingPathComponent(sport.historyFileName)
    }

    private let maxHistoryCount = 50

    func saveHistory(_ sessions: [GameSession], sport: Sport) {
        guard let data = try? encoder.encode(sessions) else { return }
        try? data.write(to: historyFileURL(for: sport), options: .atomic)
    }

    func loadHistory(sport: Sport) -> [GameSession] {
        // For volleyball, also try the legacy file
        if sport == .volleyball {
            let legacy = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
                .appendingPathComponent("game_history.json")
            if let data = try? Data(contentsOf: legacy),
               let sessions = try? decoder.decode([GameSession].self, from: data) {
                saveHistory(sessions, sport: .volleyball)
                try? FileManager.default.removeItem(at: legacy)
                return sessions
            }
        }
        guard let data = try? Data(contentsOf: historyFileURL(for: sport)),
              let sessions = try? decoder.decode([GameSession].self, from: data) else {
            return []
        }
        return sessions
    }

    func appendSession(_ session: GameSession, sport: Sport, to history: inout [GameSession]) {
        history.insert(session, at: 0)
        if history.count > maxHistoryCount {
            history = Array(history.prefix(maxHistoryCount))
        }
        saveHistory(history, sport: sport)
    }
}
