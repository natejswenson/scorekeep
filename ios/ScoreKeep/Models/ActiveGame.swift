import Foundation

struct ActiveGame: Codable {
    var sport: Sport = .volleyball
    var team1Name: String = "Team 1"
    var team2Name: String = "Team 2"
    var team1Score: Int = 0
    var team2Score: Int = 0
    var team1GamesWon: Int = 0
    var team2GamesWon: Int = 0
    // Full undo stack — each entry is the points added by one scoring action
    var team1ActionStack: [Int] = []
    var team2ActionStack: [Int] = []
    var sets: [SetResult] = []
    var sessionId: UUID = UUID()
    var startedAt: Date = Date()

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        sport             = (try? c.decode(Sport.self,      forKey: .sport)) ?? .volleyball
        team1Name         = (try? c.decode(String.self,     forKey: .team1Name)) ?? "Team 1"
        team2Name         = (try? c.decode(String.self,     forKey: .team2Name)) ?? "Team 2"
        team1Score        = (try? c.decode(Int.self,        forKey: .team1Score)) ?? 0
        team2Score        = (try? c.decode(Int.self,        forKey: .team2Score)) ?? 0
        team1GamesWon     = (try? c.decode(Int.self,        forKey: .team1GamesWon)) ?? 0
        team2GamesWon     = (try? c.decode(Int.self,        forKey: .team2GamesWon)) ?? 0
        // Migrate legacy single-action field → one-element stack if present
        if let old1 = try? c.decode(Int.self, forKey: .team1ActionStack) {
            team1ActionStack = [old1]
        } else {
            team1ActionStack = (try? c.decode([Int].self, forKey: .team1ActionStack)) ?? []
        }
        if let old2 = try? c.decode(Int.self, forKey: .team2ActionStack) {
            team2ActionStack = [old2]
        } else {
            team2ActionStack = (try? c.decode([Int].self, forKey: .team2ActionStack)) ?? []
        }
        sets              = (try? c.decode([SetResult].self, forKey: .sets)) ?? []
        sessionId         = (try? c.decode(UUID.self,       forKey: .sessionId)) ?? UUID()
        startedAt         = (try? c.decode(Date.self,       forKey: .startedAt)) ?? Date()
    }

    init(
        sport: Sport = .volleyball,
        team1Name: String = "Team 1",
        team2Name: String = "Team 2",
        team1Score: Int = 0,
        team2Score: Int = 0,
        team1GamesWon: Int = 0,
        team2GamesWon: Int = 0,
        team1ActionStack: [Int] = [],
        team2ActionStack: [Int] = [],
        sets: [SetResult] = [],
        sessionId: UUID = UUID(),
        startedAt: Date = Date()
    ) {
        self.sport            = sport
        self.team1Name        = team1Name
        self.team2Name        = team2Name
        self.team1Score       = team1Score
        self.team2Score       = team2Score
        self.team1GamesWon    = team1GamesWon
        self.team2GamesWon    = team2GamesWon
        self.team1ActionStack = team1ActionStack
        self.team2ActionStack = team2ActionStack
        self.sets             = sets
        self.sessionId        = sessionId
        self.startedAt        = startedAt
    }
}
