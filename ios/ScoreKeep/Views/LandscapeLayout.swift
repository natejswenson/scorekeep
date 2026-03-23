import SwiftUI

struct LandscapeLayout: View {
    @Bindable var viewModel: GameViewModel
    var showBannerAd: Bool = false
    @State private var editingTeam: TeamSide? = nil
    @State private var landscapeSelectedPoints: Int = 6
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var undoToastMessage: String = "Undo Reset"
    @State private var showSetAlert = false
    @State private var alertDismissedAtScore: (Int, Int)? = nil
    @State private var setAlertTitleText: String = ""

    private var isChipSport: Bool {
        viewModel.activeSport == .football || viewModel.activeSport == .basketball
    }

    private var landscapePointValues: [Int] {
        viewModel.activeSport == .football ? [6, 3, 2, 1] : [3, 2, 1]
    }

    var body: some View {
        VStack(spacing: 0) {
            GeometryReader { geo in
                scoringArea(geo: geo)
            }

            if showBannerAd {
                BannerAdView()
                    .frame(height: 50)
                    .frame(maxWidth: .infinity)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: "#0e1e4a"), Color(hex: "#460808")],
                            startPoint: .leading, endPoint: .trailing
                        )
                    )
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        } // end VStack
        .onChange(of: viewModel.activeSport) { _, newSport in
            landscapeSelectedPoints = newSport == .football ? 6 : 3
        }
        .onChange(of: viewModel.setWinConditionMet) { _, met in
            handleSetWinChange(met)
        }
        .alert(setAlertTitleText, isPresented: $showSetAlert) {
            Button("Start Next Set", action: startNextSet)
            Button("Keep Playing", role: .cancel) {
                alertDismissedAtScore = (viewModel.team1Score, viewModel.team2Score)
            }
        } message: {
            Text("Win by 2 condition met.")
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

    // MARK: - Scoring Area

    @ViewBuilder
    private func scoringArea(geo: GeometryProxy) -> some View {
        ZStack {
            HStack(spacing: 0) {
                teamHalf(side: .team1)
                    .frame(width: geo.size.width / 2)
                teamHalf(side: .team2)
                    .frame(width: geo.size.width / 2)
            }

            Rectangle()
                .fill(Color(hex: "#3A3A3C"))
                .frame(width: 0.5)
                .frame(maxWidth: .infinity, alignment: .center)
                .allowsHitTesting(false)

            centerControl

            if showUndoToast {
                UndoToastView(message: undoToastMessage) {
                    viewModel.undoReset()
                    dismissToast()
                }
                .transition(.asymmetric(
                    insertion: .move(edge: .bottom).combined(with: .opacity),
                    removal: .opacity
                ))
                .zIndex(10)
            }

            matchWonOverlay
        }
    }

    @ViewBuilder
    private var centerControl: some View {
        if isChipSport {
            VStack {
                landscapeChipPanel.padding(.top, 60)
                Spacer()
            }
            .allowsHitTesting(true)
        } else if viewModel.activeSport == .volleyball {
            SetCompleteButton {
                let nextSet = viewModel.team1GamesWon + viewModel.team2GamesWon + 2
                if viewModel.team1Score > viewModel.team2Score {
                    undoToastMessage = "\(viewModel.team1Name) won the Set · Starting Set \(nextSet)"
                } else if viewModel.team2Score > viewModel.team1Score {
                    undoToastMessage = "\(viewModel.team2Name) won the Set · Starting Set \(nextSet)"
                } else {
                    undoToastMessage = "Set complete · Starting Set \(nextSet)"
                }
                viewModel.handleReset()
                triggerUndoToast()
            }
        } else {
            ResetButton {
                undoToastMessage = "Undo Reset"
                viewModel.handleReset()
                triggerUndoToast()
            }
        }
    }

    // MARK: - Match Won Overlay

    @ViewBuilder
    private var matchWonOverlay: some View {
        if viewModel.activeSport == .volleyball, let winner = viewModel.matchWinner {
            let winnerName = winner == .team1 ? viewModel.team1Name : viewModel.team2Name
            ZStack {
                Color.black.opacity(0.72).ignoresSafeArea()
                VStack(spacing: 16) {
                    Text("MATCH WON")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.white.opacity(0.55))
                        .kerning(2.5)
                    Text(winnerName.uppercased())
                        .font(.custom("Digital-7", size: 72))
                        .foregroundColor(Color(hex: "#FFD700").opacity(0.95))
                        .minimumScaleFactor(0.4)
                        .lineLimit(1)
                        .padding(.horizontal, 24)
                    Button {
                        viewModel.startNewGame()
                        alertDismissedAtScore = nil
                    } label: {
                        Text("NEW MATCH")
                            .font(.system(size: 13, weight: .semibold))
                            .kerning(1.5)
                            .foregroundColor(.black)
                            .padding(.horizontal, 28)
                            .padding(.vertical, 12)
                            .background(Color(hex: "#FFD700"), in: Capsule())
                    }
                }
            }
            .transition(.opacity.animation(.easeIn(duration: 0.3)))
            .zIndex(20)
        }
    }

    // MARK: - Chip Panel

    @ViewBuilder
    private var landscapeChipPanel: some View {
        HStack(spacing: 4) {
            ForEach(landscapePointValues, id: \.self) { pts in
                ScoringChip(
                    points: pts,
                    accentColor: .white,
                    isSelected: landscapeSelectedPoints == pts
                ) {
                    landscapeSelectedPoints = pts
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                }
                .frame(width: 54, height: 44)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture { }
    }

    // MARK: - Sport Routing

    @ViewBuilder
    private func teamHalf(side: TeamSide) -> some View {
        let name  = side == .team1 ? viewModel.team1Name  : viewModel.team2Name
        let score = side == .team1 ? viewModel.team1Score : viewModel.team2Score

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
                isPortrait: false,
                canUndo: viewModel.canUndoGlobal,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastGlobalAction() },
                externalSelectedPoints: landscapeSelectedPoints
            )
        case .basketball:
            BasketballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: false,
                canUndo: viewModel.canUndoGlobal,
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
            withAnimation(.spring(response: 0.25, dampingFraction: 0.8)) { showUndoToast = true }
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
        withAnimation(.easeOut(duration: 0.2)) { showUndoToast = false }
    }

    private func handleSetWinChange(_ met: Bool) {
        guard met else { return }
        let key = (viewModel.team1Score, viewModel.team2Score)
        if let dismissed = alertDismissedAtScore, dismissed == key { return }
        if viewModel.team1Score > viewModel.team2Score {
            setAlertTitleText = "\(viewModel.team1Name) wins the set \(viewModel.team1Score)–\(viewModel.team2Score)"
        } else {
            setAlertTitleText = "\(viewModel.team2Name) wins the set \(viewModel.team2Score)–\(viewModel.team1Score)"
        }
        showSetAlert = true
    }

    private func startNextSet() {
        let nextSet = viewModel.team1GamesWon + viewModel.team2GamesWon + 2
        if viewModel.team1Score > viewModel.team2Score {
            undoToastMessage = "\(viewModel.team1Name) won the Set · Starting Set \(nextSet)"
        } else {
            undoToastMessage = "\(viewModel.team2Name) won the Set · Starting Set \(nextSet)"
        }
        viewModel.handleReset()
        triggerUndoToast()
    }
}
