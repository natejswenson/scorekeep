import SwiftUI

struct PortraitLayout: View {
    @Bindable var viewModel: GameViewModel
    @State private var editingTeam: TeamSide? = nil

    var body: some View {
        GeometryReader { geo in
            ZStack {
                VStack(spacing: 0) {
                    // Team 1 half
                    TeamHalfView(
                        side: .team1,
                        teamName: viewModel.team1Name,
                        score: viewModel.team1Score,
                        gamesWon: viewModel.team1GamesWon,
                        isPortrait: true,
                        onTapName: { editingTeam = .team1 },
                        viewModel: viewModel
                    )
                    .frame(height: geo.size.height / 2)

                    // Team 2 half
                    TeamHalfView(
                        side: .team2,
                        teamName: viewModel.team2Name,
                        score: viewModel.team2Score,
                        gamesWon: viewModel.team2GamesWon,
                        isPortrait: true,
                        onTapName: { editingTeam = .team2 },
                        viewModel: viewModel
                    )
                    .frame(height: geo.size.height / 2)
                }

                // Hairline separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(height: 0.5)
                    .frame(maxHeight: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Reset button centered on divider
                ResetButton {
                    viewModel.resetSet()
                }
            }
        }
        .sheet(item: $editingTeam) { team in
            TeamNameEditSheet(
                isPresented: Binding(
                    get: { editingTeam != nil },
                    set: { if !$0 { editingTeam = nil } }
                ),
                currentName: team == .team1 ? viewModel.team1Name : viewModel.team2Name,
                onSave: { name in viewModel.updateTeamName(name, team: team) }
            )
        }
    }
}

extension TeamSide: Identifiable {
    var id: Int { self == .team1 ? 1 : 2 }
}
