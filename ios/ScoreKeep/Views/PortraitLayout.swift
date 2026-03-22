import SwiftUI

struct PortraitLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
    @Binding var showOnboarding: Bool
    @State private var editingTeam: TeamSide? = nil
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var showSportSelector = false
    @State private var portraitSelectedPoints: Int = 6

    private var isChipSport: Bool {
        viewModel.activeSport == .football || viewModel.activeSport == .basketball
    }

    private var portraitPointValues: [Int] {
        viewModel.activeSport == .football ? [6, 3, 2, 1] : [3, 2, 1]
    }

    private var portraitAccentColor: Color {
        Color(hex: viewModel.activeSport.glowHex)
    }

    private var portraitCanUndo: Bool { viewModel.canUndoGlobal }

    var body: some View {
        GeometryReader { geo in
            ZStack {
                VStack(spacing: 0) {
                    teamHalf(side: .team1)
                        .frame(height: geo.size.height / 2)

                    teamHalf(side: .team2)
                        .frame(height: geo.size.height / 2)
                }

                // Hairline separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(height: 0.5)
                    .frame(maxHeight: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Center element: reset (volleyball) or shared chip panel (football/basketball)
                if viewModel.activeSport == .volleyball {
                    ResetButton {
                        viewModel.handleReset()
                        triggerUndoToast()
                    }
                    .frame(maxHeight: .infinity, alignment: .center)
                } else if isChipSport {
                    portraitChipPanel
                        .frame(maxHeight: .infinity, alignment: .center)
                }

                // Top icon bar — clock left, sport icon + i-button right
                VStack {
                    HStack {
                        Button { showHistory = true } label: {
                            Image(systemName: "clock")
                                .font(.system(size: 15, weight: .light))
                                .foregroundStyle(Color(hex: "#636366"))
                                .frame(width: 44, height: 44)
                                .contentShape(Rectangle())
                        }

                        Spacer()

                        Button { showSportSelector = true } label: {
                            Image(systemName: viewModel.activeSport.systemImageName)
                                .font(.system(size: 15, weight: .light))
                                .foregroundStyle(Color(hex: "#636366"))
                                .frame(width: 44, height: 44)
                                .contentShape(Rectangle())
                        }

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
                    .padding(.horizontal, 8)
                    .padding(.top, 4)

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
        .onChange(of: viewModel.activeSport) { _, newSport in
            portraitSelectedPoints = newSport == .football ? 6 : 3
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

    // MARK: - Shared portrait chip panel

    @ViewBuilder
    private var portraitChipPanel: some View {
        VStack(spacing: 6) {
            HStack(spacing: 8) {
                ForEach(portraitPointValues, id: \.self) { pts in
                    ScoringChip(
                        points: pts,
                        accentColor: portraitAccentColor,
                        isSelected: portraitSelectedPoints == pts
                    ) {
                        portraitSelectedPoints = pts
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)
                }
            }
            UndoChip(canUndo: portraitCanUndo) {
                portraitUndo()
            }
            .frame(maxWidth: .infinity)
            .frame(height: 26)
        }
        .padding(.horizontal, 20)
    }

    private func portraitUndo() {
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
                isPortrait: true, showGamesWon: true,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .soccer:
            TeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: true, showGamesWon: false,
                onTapName: { editingTeam = side }, viewModel: viewModel
            )
        case .football:
            FootballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: true, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastGlobalAction() },
                externalSelectedPoints: portraitSelectedPoints
            )
        case .basketball:
            BasketballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: true, canUndo: canUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastGlobalAction() },
                externalSelectedPoints: portraitSelectedPoints
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
