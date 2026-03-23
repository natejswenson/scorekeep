import SwiftUI

struct PortraitLayout: View {
    @Bindable var viewModel: GameViewModel
    @State private var editingTeam: TeamSide? = nil
    @State private var portraitSelectedPoints: Int = 6
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var undoToastMessage: String = "Undo Reset"
    @State private var showSetAlert = false
    @State private var alertDismissedAtScore: (Int, Int)? = nil
    @State private var setAlertTitleText: String = ""

    private var isChipSport: Bool {
        viewModel.activeSport == .football || viewModel.activeSport == .basketball
    }

    private var portraitPointValues: [Int] {
        viewModel.activeSport == .football ? [6, 3, 2, 1] : [3, 2, 1]
    }

    private let chipPanelHeight: CGFloat = 64

    var body: some View {
        GeometryReader { geo in
            scoringArea(geo: geo)
        }
        .onChange(of: viewModel.activeSport) { _, s in
            portraitSelectedPoints = s == .football ? 6 : 3
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
                isPresented: Binding(get: { editingTeam != nil }, set: { if !$0 { editingTeam = nil } }),
                currentName: team == .team1 ? viewModel.team1Name : viewModel.team2Name,
                onSave: { name in viewModel.updateTeamName(name, team: team) }
            )
        }
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

    // MARK: - Scoring Area

    @ViewBuilder
    private func scoringArea(geo: GeometryProxy) -> some View {
        ZStack {
            if isChipSport {
                VStack(spacing: 0) {
                    teamHalf(side: .team1)
                        .frame(height: (geo.size.height - chipPanelHeight) / 2)
                    portraitChipPanel
                        .frame(maxWidth: .infinity)
                        .frame(height: chipPanelHeight)
                    teamHalf(side: .team2)
                        .frame(height: (geo.size.height - chipPanelHeight) / 2)
                }
            } else {
                nonChipContent(geo: geo)
            }

            matchWonOverlay
        }
    }

    @ViewBuilder
    private func nonChipContent(geo: GeometryProxy) -> some View {
        VStack(spacing: 0) {
            teamHalf(side: .team1).frame(height: geo.size.height / 2)
            teamHalf(side: .team2).frame(height: geo.size.height / 2)
        }

        Rectangle()
            .fill(Color(hex: "#3A3A3C"))
            .frame(height: 0.5)
            .frame(maxHeight: .infinity, alignment: .center)
            .allowsHitTesting(false)

        dividerControl
            .frame(maxHeight: .infinity, alignment: .center)

        if showUndoToast {
            UndoToastView(message: undoToastMessage) {
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

        if viewModel.activeSport == .volleyball {
            winsOverlay
        }
    }

    @ViewBuilder
    private var dividerControl: some View {
        if viewModel.activeSport == .volleyball {
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

    private var winsOverlay: some View {
        HStack {
            Spacer()
            VStack(spacing: 2) {
                Text("\(viewModel.team1GamesWon)")
                    .font(.custom("Digital-7", size: 24))
                    .foregroundColor(.white.opacity(0.80))
                Text("WINS")
                    .font(.system(size: 8, weight: .medium))
                    .foregroundColor(.white.opacity(0.40))
                    .kerning(1.4)
                Text("\(viewModel.team2GamesWon)")
                    .font(.custom("Digital-7", size: 24))
                    .foregroundColor(.white.opacity(0.80))
            }
            .padding(.trailing, 28)
        }
        .frame(maxHeight: .infinity, alignment: .center)
        .allowsHitTesting(false)
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
                        .font(.custom("Digital-7", size: 56))
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
    private var portraitChipPanel: some View {
        HStack(spacing: 4) {
            ForEach(portraitPointValues, id: \.self) { pts in
                ScoringChip(
                    points: pts,
                    accentColor: .white,
                    isSelected: portraitSelectedPoints == pts
                ) {
                    portraitSelectedPoints = pts
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                }
                .frame(width: 54, height: 44)
            }
        }
        .contentShape(Rectangle())
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
                isPortrait: true, showGamesWon: false,
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
                isPortrait: true,
                canUndo: side == .team1 ? viewModel.team1CanUndo : viewModel.team2CanUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastAction(team: side) },
                externalSelectedPoints: portraitSelectedPoints
            )
        case .basketball:
            BasketballTeamHalfView(
                side: side, teamName: name, score: score,
                isPortrait: true,
                canUndo: side == .team1 ? viewModel.team1CanUndo : viewModel.team2CanUndo,
                onTapName: { editingTeam = side },
                onScore: { pts in viewModel.addScore(team: side, points: pts) },
                onUndo: { viewModel.undoLastAction(team: side) },
                externalSelectedPoints: portraitSelectedPoints
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
}

extension TeamSide: Identifiable {
    var id: Int { self == .team1 ? 1 : 2 }
}
