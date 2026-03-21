import Foundation

struct ActiveGame: Codable {
    var team1Name: String = "Team 1"
    var team2Name: String = "Team 2"
    var team1Score: Int = 0
    var team2Score: Int = 0
    var team1GamesWon: Int = 0
    var team2GamesWon: Int = 0
    var sets: [SetResult] = []
    var sessionId: UUID = UUID()
    var startedAt: Date = Date()
}
