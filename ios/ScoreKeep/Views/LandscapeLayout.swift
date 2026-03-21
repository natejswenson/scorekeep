import SwiftUI

struct LandscapeLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
    @State private var editingTeam: TeamSide? = nil

    var body: some View {
        GeometryReader { geo in
            ZStack {
                HStack(spacing: 0) {
                    // Team 1 half
                    TeamHalfView(
                        side: .team1,
                        teamName: viewModel.team1Name,
                        score: viewModel.team1Score,
                        gamesWon: viewModel.team1GamesWon,
                        isPortrait: false,
                        onTapName: { editingTeam = .team1 },
                        viewModel: viewModel
                    )
                    .frame(width: geo.size.width / 2)

                    // Team 2 half
                    TeamHalfView(
                        side: .team2,
                        teamName: viewModel.team2Name,
                        score: viewModel.team2Score,
                        gamesWon: viewModel.team2GamesWon,
                        isPortrait: false,
                        onTapName: { editingTeam = .team2 },
                        viewModel: viewModel
                    )
                    .frame(width: geo.size.width / 2)
                }

                // Hairline vertical separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(width: 0.5)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Divider controls — vertical stack on the center line
                VStack(spacing: 16) {
                    Button {
                        showHistory = true
                    } label: {
                        Image(systemName: "clock")
                            .font(.system(size: 13, weight: .light))
                            .foregroundStyle(Color(hex: "#3A3A3C"))
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }

                    ResetButton {
                        viewModel.resetSet()
                    }
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
