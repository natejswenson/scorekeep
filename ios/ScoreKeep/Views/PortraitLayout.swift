import SwiftUI

struct PortraitLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
    @Binding var showOnboarding: Bool
    @State private var editingTeam: TeamSide? = nil
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var showSportSelector = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                VStack(spacing: 0) {
                    teamHalf(side: .team1, isPortrait: true)
                        .frame(height: geo.size.height / 2)

                    teamHalf(side: .team2, isPortrait: true)
                        .frame(height: geo.size.height / 2)
                }

                // Hairline separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(height: 0.5)
                    .frame(maxHeight: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Divider controls: reset center, history left, i-button right
                ZStack {
                    ResetButton {
                        viewModel.handleReset()
                        if viewModel.activeSport == .volleyball {
                            triggerUndoToast()
                        }
                    }

                    HStack {
                        Button { showHistory = true } label: {
                            Image(systemName: "clock")
                                .font(.system(size: 15, weight: .light))
                                .foregroundStyle(Color(hex: "#636366"))
                                .frame(width: 44, height: 44)
                                .contentShape(Rectangle())
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 28)

                    HStack {
                        Spacer()
                        Button { showOnboarding = true } label: {
                            ZStack {
                                Circle()
                                    .strokeBorder(Color(hex: "#3A3A3C"), lineWidth: 0.75)
                                    .frame(width: 28, height: 28)
                                Text("i")
                                    .font(.system(size: 13, weight: .light, design: .serif))
                                    .foregroundStyle(Color(hex: "#636366"))
                            }
                        }
                        .frame(width: 44, height: 44)
                        .contentShape(Rectangle())
                    }
                    .padding(.horizontal, 28)
                }
                .frame(maxHeight: .infinity, alignment: .center)

                // Sport switcher — top center
                VStack {
                    SportSwitcherButton(sport: viewModel.activeSport) {
                        showSportSelector = true
                    }
                    .padding(.top, 14)
                    Spacer()
                }
                .allowsHitTesting(true)
                .zIndex(15)

                // Undo toast (volleyball only)
                if showUndoToast {
                    UndoToastView {
                        viewModel.undoReset()
                        dismissToast()
                    }
                    .frame(maxHeight: .infinity, alignment: .center)
                    .transition(.asymmetric(
                        insertion: .move(edge: .bottom).combined(with: .opacity),
                        removal: .opacity
                    ))
                    .zIndex(10)
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
        .sheet(isPresented: $showSportSelector) {
            SportSelectorSheet(
                isPresented: $showSportSelector,
                currentSport: viewModel.activeSport,
                hasNonZeroScore: viewModel.hasNonZeroScore,
                onSelectSport: { sport in viewModel.switchSport(sport) }
            )
            .presentationDetents([.height(340)])
            .presentationDragIndicator(.hidden)
        }
    }

    // MARK: - Sport Routing

    @ViewBuilder
    private func teamHalf(side: TeamSide, isPortrait: Bool) -> some View {
        let name    = side == .team1 ? viewModel.team1Name    : viewModel.team2Name
        let score   = side == .team1 ? viewModel.team1Score   : viewModel.team2Score
        let canUndo = side == .team1 ? viewModel.team1CanUndo : viewModel.team2CanUndo

        switch viewModel.activeSport {
        case .volleyball:
            TeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: isPortrait, showGamesWon: true,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .soccer:
            TeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: isPortrait, showGamesWon: false,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .football:
            FootballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: isPortrait, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastAction(team: side) }
            )
        case .basketball:
            BasketballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: isPortrait, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastAction(team: side) }
            )
        }
    }

    // MARK: - Toast Lifecycle

    private func triggerUndoToast() {
        undoToastTask?.cancel()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            withAnimation(.spring(response: 0.25, dampingFraction: 0.8)) {
                showUndoToast = true
            }
            undoToastTask = Task {
                try? await Task.sleep(for: .seconds(4))
                guard !Task.isCancelled else { return }
                await MainActor.run { dismissToast() }
            }
        }
    }

    private func dismissToast() {
        undoToastTask?.cancel()
        undoToastTask = nil
        withAnimation(.easeOut(duration: 0.2)) {
            showUndoToast = false
        }
    }
}

extension TeamSide: Identifiable {
    var id: Int { self == .team1 ? 1 : 2 }
}
