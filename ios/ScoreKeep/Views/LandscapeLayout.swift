import SwiftUI

struct LandscapeLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
    @Binding var showOnboarding: Bool
    @State private var editingTeam: TeamSide? = nil
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var showSportSelector = false
    @State private var landscapeSelectedPoints: Int = 6

    private var isChipSport: Bool {
        viewModel.activeSport == .football || viewModel.activeSport == .basketball
    }

    private var landscapePointValues: [Int] {
        viewModel.activeSport == .football ? [6, 3, 2, 1] : [3, 2, 1]
    }

    private var landscapeAccentColor: Color {
        Color(hex: viewModel.activeSport.glowHex)
    }

    private var landscapeCanUndo: Bool { viewModel.canUndoGlobal }

    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Team halves
                HStack(spacing: 0) {
                    teamHalf(side: .team1)
                        .frame(width: geo.size.width / 2)

                    teamHalf(side: .team2)
                        .frame(width: geo.size.width / 2)
                }

                // Hairline vertical separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(width: 0.5)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Clock top, i-button bottom
                VStack {
                    Button { showHistory = true } label: {
                        Image(systemName: "clock")
                            .font(.system(size: 15, weight: .light))
                            .foregroundStyle(Color(hex: "#636366"))
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }
                    .padding(.top, 16)

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
                    .padding(.bottom, 16)
                }
                .frame(maxHeight: .infinity)

                // Center element: reset (volleyball) or chip panel (football/basketball)
                if viewModel.activeSport == .volleyball {
                    ResetButton {
                        viewModel.handleReset()
                        triggerUndoToast()
                    }
                } else if isChipSport {
                    landscapeChipPanel
                }

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
                    .transition(.asymmetric(
                        insertion: .move(edge: .bottom).combined(with: .opacity),
                        removal: .opacity
                    ))
                    .zIndex(10)
                }
            }
        }
        .onChange(of: viewModel.activeSport) { _, newSport in
            landscapeSelectedPoints = newSport == .football ? 6 : 3
            lastScoredTeam = nil
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

    // MARK: - Shared landscape chip panel

    @ViewBuilder
    private var landscapeChipPanel: some View {
        let panelWidth: CGFloat = viewModel.activeSport == .football ? 200 : 156

        VStack(spacing: 6) {
            HStack(spacing: 8) {
                ForEach(landscapePointValues, id: \.self) { pts in
                    ScoringChip(
                        points: pts,
                        accentColor: landscapeAccentColor,
                        isSelected: landscapeSelectedPoints == pts
                    ) {
                        landscapeSelectedPoints = pts
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                    .frame(height: 32)
                }
            }
            UndoChip(canUndo: landscapeCanUndo) {
                landscapeUndo()
            }
            .frame(height: 26)
        }
        .frame(width: panelWidth)
    }

    private func landscapeUndo() {
        viewModel.undoLastGlobalAction()
    }

    // MARK: - Sport Routing

    @ViewBuilder
    private func teamHalf(side: TeamSide) -> some View {
        let name    = side == .team1 ? viewModel.team1Name    : viewModel.team2Name
        let score   = side == .team1 ? viewModel.team1Score   : viewModel.team2Score
        let canUndo = side == .team1 ? viewModel.team1CanUndo : viewModel.team2CanUndo

        switch viewModel.activeSport {
        case .volleyball:
            TeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: false, showGamesWon: true,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .soccer:
            TeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: false, showGamesWon: false,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .football:
            FootballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: false, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastGlobalAction() },
                externalSelectedPoints: landscapeSelectedPoints
            )
        case .basketball:
            BasketballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: false, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastGlobalAction() },
                externalSelectedPoints: landscapeSelectedPoints
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
