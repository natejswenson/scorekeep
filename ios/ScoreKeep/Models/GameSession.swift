import Foundation

struct SetResult: Codable, Equatable {
    var team1Score: Int
    var team2Score: Int
    var completedAt: Date
}

struct GameSession: Codable, Identifiable, Equatable {
    let id: UUID
    var sport: Sport
    var team1Name: String
    var team2Name: String
    // Volleyball: games won per team
    var team1GamesWon: Int
    var team2GamesWon: Int
    var sets: [SetResult]
    // Non-volleyball: final scores
    var team1FinalScore: Int
    var team2FinalScore: Int
    var startedAt: Date
    var endedAt: Date?

    // Custom decoder for backward compatibility — old sessions lack sport + finalScores
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id               = try c.decode(UUID.self,         forKey: .id)
        sport            = (try? c.decode(Sport.self,      forKey: .sport)) ?? .volleyball
        team1Name        = try c.decode(String.self,       forKey: .team1Name)
        team2Name        = try c.decode(String.self,       forKey: .team2Name)
        team1GamesWon    = (try? c.decode(Int.self,        forKey: .team1GamesWon)) ?? 0
        team2GamesWon    = (try? c.decode(Int.self,        forKey: .team2GamesWon)) ?? 0
        sets             = (try? c.decode([SetResult].self, forKey: .sets)) ?? []
        team1FinalScore  = (try? c.decode(Int.self,        forKey: .team1FinalScore)) ?? 0
        team2FinalScore  = (try? c.decode(Int.self,        forKey: .team2FinalScore)) ?? 0
        startedAt        = (try? c.decode(Date.self,       forKey: .startedAt)) ?? Date()
        endedAt          = try? c.decode(Date.self,        forKey: .endedAt)
    }

    init(
        id: UUID = UUID(),
        sport: Sport,
        team1Name: String,
        team2Name: String,
        team1GamesWon: Int = 0,
        team2GamesWon: Int = 0,
        sets: [SetResult] = [],
        team1FinalScore: Int = 0,
        team2FinalScore: Int = 0,
        startedAt: Date,
        endedAt: Date? = nil
    ) {
        self.id              = id
        self.sport           = sport
        self.team1Name       = team1Name
        self.team2Name       = team2Name
        self.team1GamesWon   = team1GamesWon
        self.team2GamesWon   = team2GamesWon
        self.sets            = sets
        self.team1FinalScore = team1FinalScore
        self.team2FinalScore = team2FinalScore
        self.startedAt       = startedAt
        self.endedAt         = endedAt
    }
}
