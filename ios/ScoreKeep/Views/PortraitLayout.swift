import SwiftUI

struct PortraitLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
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

                // Divider controls — reset centered, history icon overlaid left
                ZStack {
                    // Reset button — always centered
                    ResetButton {
                        viewModel.resetSet()
                    }

                    // History icon — left edge, doesn't affect reset centering
                    HStack {
                        Button {
                            showHistory = true
                        } label: {
                            Image(systemName: "clock")
                                .font(.system(size: 13, weight: .light))
                                .foregroundStyle(Color(hex: "#3A3A3C"))
                                .frame(width: 44, height: 44)
                                .contentShape(Rectangle())
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 28)
                }
                .frame(maxHeight: .infinity, alignment: .center)
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
