import Foundation

struct SetResult: Codable, Equatable {
    var team1Score: Int
    var team2Score: Int
    var completedAt: Date
}

struct GameSession: Codable, Identifiable, Equatable {
    let id: UUID
    var team1Name: String
    var team2Name: String
    var team1GamesWon: Int
    var team2GamesWon: Int
    var sets: [SetResult]
    var startedAt: Date
    var endedAt: Date?
}
