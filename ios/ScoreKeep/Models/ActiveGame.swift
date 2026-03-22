import Foundation

struct ActiveGame: Codable {
    var sport: Sport = .volleyball
    var team1Name: String = "Team 1"
    var team2Name: String = "Team 2"
    var team1Score: Int = 0
    var team2Score: Int = 0
    var team1GamesWon: Int = 0
    var team2GamesWon: Int = 0
    var team1LastAction: Int? = nil
    var team2LastAction: Int? = nil
    var sets: [SetResult] = []
    var sessionId: UUID = UUID()
    var startedAt: Date = Date()

    // Custom decoder for backward compatibility with saved data that lacks the new fields.
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        sport          = (try? c.decode(Sport.self, forKey: .sport)) ?? .volleyball
        team1Name      = (try? c.decode(String.self, forKey: .team1Name)) ?? "Team 1"
        team2Name      = (try? c.decode(String.self, forKey: .team2Name)) ?? "Team 2"
        team1Score     = (try? c.decode(Int.self,    forKey: .team1Score)) ?? 0
        team2Score     = (try? c.decode(Int.self,    forKey: .team2Score)) ?? 0
        team1GamesWon  = (try? c.decode(Int.self,    forKey: .team1GamesWon)) ?? 0
        team2GamesWon  = (try? c.decode(Int.self,    forKey: .team2GamesWon)) ?? 0
        team1LastAction = try? c.decode(Int.self,    forKey: .team1LastAction)
        team2LastAction = try? c.decode(Int.self,    forKey: .team2LastAction)
        sets           = (try? c.decode([SetResult].self, forKey: .sets)) ?? []
        sessionId      = (try? c.decode(UUID.self,   forKey: .sessionId)) ?? UUID()
        startedAt      = (try? c.decode(Date.self,   forKey: .startedAt)) ?? Date()
    }

    init(
        sport: Sport = .volleyball,
        team1Name: String = "Team 1",
        team2Name: String = "Team 2",
        team1Score: Int = 0,
        team2Score: Int = 0,
        team1GamesWon: Int = 0,
        team2GamesWon: Int = 0,
        team1LastAction: Int? = nil,
        team2LastAction: Int? = nil,
        sets: [SetResult] = [],
        sessionId: UUID = UUID(),
        startedAt: Date = Date()
    ) {
        self.sport          = sport
        self.team1Name      = team1Name
        self.team2Name      = team2Name
        self.team1Score     = team1Score
        self.team2Score     = team2Score
        self.team1GamesWon  = team1GamesWon
        self.team2GamesWon  = team2GamesWon
        self.team1LastAction = team1LastAction
        self.team2LastAction = team2LastAction
        self.sets           = sets
        self.sessionId      = sessionId
        self.startedAt      = startedAt
    }
}
