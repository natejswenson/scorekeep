import Foundation

final class PersistenceService {
    static let shared = PersistenceService()
    private init() {}

    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    // MARK: - Active Game (UserDefaults)

    private let activeGameKey = "activeGame"

    func saveActiveGame(_ game: ActiveGame) {
        guard let data = try? encoder.encode(game) else { return }
        UserDefaults.standard.set(data, forKey: activeGameKey)
    }

    func loadActiveGame() -> ActiveGame? {
        guard let data = UserDefaults.standard.data(forKey: activeGameKey),
              let game = try? decoder.decode(ActiveGame.self, from: data) else {
            return nil
        }
        return game
    }

    // MARK: - Game History (FileManager JSON)

    private var historyFileURL: URL {
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return docs.appendingPathComponent("game_history.json")
    }

    private let maxHistoryCount = 50

    func saveHistory(_ sessions: [GameSession]) {
        guard let data = try? encoder.encode(sessions) else { return }
        try? data.write(to: historyFileURL, options: .atomic)
    }

    func loadHistory() -> [GameSession] {
        guard let data = try? Data(contentsOf: historyFileURL),
              let sessions = try? decoder.decode([GameSession].self, from: data) else {
            return []
        }
        return sessions
    }

    func appendSession(_ session: GameSession, to history: inout [GameSession]) {
        history.insert(session, at: 0) // newest first
        if history.count > maxHistoryCount {
            history = Array(history.prefix(maxHistoryCount))
        }
        saveHistory(history)
    }
}
