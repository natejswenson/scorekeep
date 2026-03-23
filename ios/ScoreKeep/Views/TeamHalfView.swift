import SwiftUI

struct TeamHalfView: View {
    let side: TeamSide
    let teamName: String
    let score: Int
    let isPortrait: Bool
    var showGamesWon: Bool = true
    let onTapName: () -> Void
    var viewModel: GameViewModel

    @State private var flashOpacity: Double = 0
    @State private var flashColor: Color = .white
    @State private var scoreScale: CGFloat = 1.0
    @State private var pressStartTime: Date?

    private let longPressDuration: TimeInterval = 0.45

    private var backgroundColor: LinearGradient {
        let theme = SettingsManager.shared.activeTheme
        return side == .team1
            ? LinearGradient(colors: [Color(hex: theme.team1Top), Color(hex: theme.team1Bottom)], startPoint: .top, endPoint: .bottom)
            : LinearGradient(colors: [Color(hex: theme.team2Top), Color(hex: theme.team2Bottom)], startPoint: .top, endPoint: .bottom)
    }

    var body: some View {
        GeometryReader { geo in
            let scoreSize = isPortrait
                ? geo.size.height * 0.55
                : min(geo.size.height * 0.52, geo.size.width * 0.80)
            ZStack {
                backgroundColor.ignoresSafeArea()

                flashColor
                    .opacity(flashOpacity)
                    .ignoresSafeArea()
                    .allowsHitTesting(false)

                if isPortrait {
                    portraitContent(scoreSize: scoreSize)
                } else {
                    landscapeContent(scoreSize: scoreSize)
                }
            }
        }
        .contentShape(Rectangle())
        // Single gesture: measure duration to decide tap vs long-press
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if pressStartTime == nil { pressStartTime = Date() }
                }
                .onEnded { _ in
                    defer { pressStartTime = nil }
                    let elapsed = pressStartTime.map { Date().timeIntervalSince($0) } ?? 0
                    if elapsed >= longPressDuration {
                        handleDecrement()
                    } else {
                        handleIncrement()
                    }
                }
        )
    }

    // MARK: - Layouts

    private func portraitContent(scoreSize: CGFloat) -> some View {
        ZStack {
            // Score: always centered
            scoreLabel(size: scoreSize)

            if side == .team1 {
                VStack(spacing: 0) {
                    // Team name top-center
                    teamNameLabel
                        .padding(.top, 20)
                    Spacer()
                    // Games won bottom-left (volleyball only)
                    if showGamesWon {
                        HStack {
                            gamesWonBadge(alignment: .leading)
                                .padding(.leading, 28)
                                .padding(.bottom, 28)
                            Spacer()
                        }
                    }
                }
            } else {
                VStack(spacing: 0) {
                    // Games won top-right (volleyball only)
                    if showGamesWon {
                        HStack {
                            Spacer()
                            gamesWonBadge(alignment: .trailing)
                                .padding(.trailing, 28)
                                .padding(.top, 28)
                        }
                    }
                    Spacer()
                    // Team name bottom-center
                    teamNameLabel
                        .padding(.bottom, 20)
                }
            }
        }
    }

    private func landscapeContent(scoreSize: CGFloat) -> some View {
        VStack(spacing: 0) {
            teamNameLabel
                .padding(.top, 20)
            Spacer()
            scoreLabel(size: scoreSize)
            Spacer()
            if showGamesWon {
                gamesWonBadge(alignment: .center)
                    .padding(.bottom, 20)
            }
        }
        .padding(.horizontal, 16)
    }

    // MARK: - Components

    private var teamNameLabel: some View {
        Text(teamName)
            .font(.system(size: 15, weight: .regular))
            .foregroundColor(Color(hex: "#8E8E93"))
            .onTapGesture { onTapName() }
            .padding(.vertical, 4)
            .padding(.horizontal, 12)
            .contentShape(Rectangle())
    }

    private func scoreLabel(size: CGFloat) -> some View {
        Text("\(score)")
            .font(.custom("Digital-7", size: size))
            .foregroundColor(.white)
            .minimumScaleFactor(0.3)
            .lineLimit(1)
            .scaleEffect(scoreScale)
            .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)
    }

    private var currentGamesWon: Int {
        side == .team1 ? viewModel.team1GamesWon : viewModel.team2GamesWon
    }

    private func gamesWonBadge(alignment: HorizontalAlignment) -> some View {
        VStack(alignment: alignment, spacing: 3) {
            Text("\(currentGamesWon)")
                .font(.system(size: 24, weight: .thin, design: .default))
                .foregroundColor(.white)
            Text("GAMES WON")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(Color(hex: "#636366"))
                .kerning(1.4)
        }
    }

    // MARK: - Interaction Handlers

    private func handleIncrement() {
        viewModel.incrementScore(team: side)
        triggerFlash(color: Color(white: 1, opacity: 0.04))
        animateScoreIn(from: 0.85)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func handleDecrement() {
        let scoreBefore = side == .team1 ? viewModel.team1Score : viewModel.team2Score
        guard scoreBefore > 0 else { return }
        viewModel.decrementScore(team: side)
        triggerFlash(color: Color(red: 1, green: 0.231, blue: 0, opacity: 0.04))
        animateScoreIn(from: 1.1)
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    private func triggerFlash(color: Color) {
        flashColor = color
        withAnimation(.easeIn(duration: 0.06)) { flashOpacity = 1 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
            withAnimation(.easeOut(duration: 0.06)) { flashOpacity = 0 }
        }
    }

    private func animateScoreIn(from startScale: CGFloat) {
        scoreScale = startScale
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) {
            scoreScale = 1.0
        }
    }
}
