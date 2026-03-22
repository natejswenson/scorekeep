import XCTest
@testable import ScoreKeep

final class GameViewModelTests: XCTestCase {

    // Clear UserDefaults and history file before each test
    override func setUp() {
        super.setUp()
        UserDefaults.standard.removeObject(forKey: "activeGame")
        let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let historyURL = docs.appendingPathComponent("game_history.json")
        try? FileManager.default.removeItem(at: historyURL)
    }

    // MARK: - incrementScore

    func test_incrementScore_team1_increasesByOne() {
        let vm = GameViewModel()
        vm.incrementScore(team: .team1)
        XCTAssertEqual(vm.team1Score, 1)
    }

    func test_incrementScore_team2_increasesByOne() {
        let vm = GameViewModel()
        vm.incrementScore(team: .team2)
        XCTAssertEqual(vm.team2Score, 1)
    }

    func test_incrementScore_doesNotAffectOtherTeam() {
        let vm = GameViewModel()
        vm.incrementScore(team: .team1)
        XCTAssertEqual(vm.team2Score, 0)
    }

    // MARK: - decrementScore

    func test_decrementScore_team1_decreasesByOne() {
        let vm = GameViewModel()
        vm.team1Score = 5
        vm.decrementScore(team: .team1)
        XCTAssertEqual(vm.team1Score, 4)
    }

    func test_decrementScore_doesNotGoBelowZero() {
        let vm = GameViewModel()
        XCTAssertEqual(vm.team1Score, 0)
        vm.decrementScore(team: .team1)
        XCTAssertEqual(vm.team1Score, 0)
    }

    func test_decrementScore_team2_doesNotGoBelowZero() {
        let vm = GameViewModel()
        vm.decrementScore(team: .team2)
        XCTAssertEqual(vm.team2Score, 0)
    }

    // MARK: - resetSet

    func test_resetSet_team1Leading_incrementsTeam1GamesWon() {
        let vm = GameViewModel()
        vm.team1Score = 10
        vm.team2Score = 5
        vm.resetSet()
        XCTAssertEqual(vm.team1GamesWon, 1)
        XCTAssertEqual(vm.team2GamesWon, 0)
    }

    func test_resetSet_team2Leading_incrementsTeam2GamesWon() {
        let vm = GameViewModel()
        vm.team1Score = 3
        vm.team2Score = 7
        vm.resetSet()
        XCTAssertEqual(vm.team1GamesWon, 0)
        XCTAssertEqual(vm.team2GamesWon, 1)
    }

    func test_resetSet_tiedScores_incrementsNeitherTeam() {
        let vm = GameViewModel()
        vm.team1Score = 5
        vm.team2Score = 5
        vm.resetSet()
        XCTAssertEqual(vm.team1GamesWon, 0)
        XCTAssertEqual(vm.team2GamesWon, 0)
    }

    func test_resetSet_resetsScoresToZero() {
        let vm = GameViewModel()
        vm.team1Score = 8
        vm.team2Score = 3
        vm.resetSet()
        XCTAssertEqual(vm.team1Score, 0)
        XCTAssertEqual(vm.team2Score, 0)
    }

    func test_resetSet_savesSetResult() {
        let vm = GameViewModel()
        vm.team1Score = 8
        vm.team2Score = 3
        vm.resetSet()
        XCTAssertEqual(vm.completedSets.count, 1)
        XCTAssertEqual(vm.completedSets[0].team1Score, 8)
        XCTAssertEqual(vm.completedSets[0].team2Score, 3)
    }

    // MARK: - startNewGame

    func test_startNewGame_savesSessionToHistory() {
        let vm = GameViewModel()
        vm.team1Score = 5
        vm.team2Score = 3
        vm.resetSet()
        vm.startNewGame()
        XCTAssertEqual(vm.gameHistory.count, 1)
    }

    func test_startNewGame_resetsScoresAndTallies() {
        let vm = GameViewModel()
        vm.team1Score = 5
        vm.team2Score = 3
        vm.resetSet()
        vm.startNewGame()
        XCTAssertEqual(vm.team1Score, 0)
        XCTAssertEqual(vm.team2Score, 0)
        XCTAssertEqual(vm.team1GamesWon, 0)
        XCTAssertEqual(vm.team2GamesWon, 0)
        XCTAssertEqual(vm.completedSets.count, 0)
    }

    func test_startNewGame_preservesTeamNames() {
        let vm = GameViewModel()
        vm.updateTeamName("Aces", team: .team1)
        vm.updateTeamName("Rockets", team: .team2)
        vm.startNewGame()
        XCTAssertEqual(vm.team1Name, "Aces")
        XCTAssertEqual(vm.team2Name, "Rockets")
    }

    // MARK: - updateTeamName

    func test_updateTeamName_trimsWhitespace() {
        let vm = GameViewModel()
        vm.updateTeamName("  Aces  ", team: .team1)
        XCTAssertEqual(vm.team1Name, "Aces")
    }

    func test_updateTeamName_rejectsEmptyString() {
        let vm = GameViewModel()
        vm.updateTeamName("Original", team: .team1)
        vm.updateTeamName("", team: .team1)
        XCTAssertEqual(vm.team1Name, "Original")
    }

    func test_updateTeamName_rejectsWhitespaceOnlyString() {
        let vm = GameViewModel()
        vm.updateTeamName("Original", team: .team1)
        vm.updateTeamName("   ", team: .team1)
        XCTAssertEqual(vm.team1Name, "Original")
    }

    // MARK: - History cap

    func test_historyCappedAt50() {
        let vm = GameViewModel()
        for _ in 0..<51 {
            vm.startNewGame()
        }
        XCTAssertEqual(vm.gameHistory.count, 50)
    }

    // MARK: - deleteHistorySession

    func test_deleteHistorySession_removesCorrectEntry() {
        let vm = GameViewModel()
        vm.startNewGame()
        vm.startNewGame()
        let idToDelete = vm.gameHistory[0].id
        vm.deleteHistorySession(id: idToDelete)
        XCTAssertFalse(vm.gameHistory.contains { $0.id == idToDelete })
    }

    // MARK: - clearAllHistory

    func test_clearAllHistory_emptiesHistory() {
        let vm = GameViewModel()
        vm.startNewGame()
        vm.startNewGame()
        vm.clearAllHistory()
        XCTAssertTrue(vm.gameHistory.isEmpty)
    }
}
