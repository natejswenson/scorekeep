import SwiftUI

struct TeamHalfView: View {
    let side: TeamSide
    let teamName: String
    let score: Int
    let gamesWon: Int
    let isPortrait: Bool
    let onTapName: () -> Void
    var viewModel: GameViewModel

    @State private var flashOpacity: Double = 0
    @State private var flashColor: Color = .white
    @State private var scoreScale: CGFloat = 1.0
    @State private var pressStartTime: Date?

    private let longPressDuration: TimeInterval = 0.45

    private var backgroundColor: Color {
        side == .team1 ? Color(hex: "#1E1E1E") : Color(hex: "#161616")
    }

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()

            flashColor
                .opacity(flashOpacity)
                .ignoresSafeArea()
                .allowsHitTesting(false)

            if isPortrait {
                portraitContent
            } else {
                landscapeContent
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

    private var portraitContent: some View {
        ZStack {
            // Score: always centered
            scoreLabel

            if side == .team1 {
                VStack(spacing: 0) {
                    // Team name top-center
                    teamNameLabel
                        .padding(.top, 20)
                    Spacer()
                    // Games won bottom-left
                    HStack {
                        gamesWonBadge(alignment: .leading)
                            .padding(.leading, 28)
                            .padding(.bottom, 28)
                        Spacer()
                    }
                }
            } else {
                VStack(spacing: 0) {
                    // Games won top-right
                    HStack {
                        Spacer()
                        gamesWonBadge(alignment: .trailing)
                            .padding(.trailing, 28)
                            .padding(.top, 28)
                    }
                    Spacer()
                    // Team name bottom-center
                    teamNameLabel
                        .padding(.bottom, 20)
                }
            }
        }
    }

    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel
                .padding(.top, 20)
            Spacer()
            scoreLabel
            Spacer()
            gamesWonBadge(alignment: .center)
                .padding(.bottom, 20)
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

    private var scoreLabel: some View {
        Text("\(score)")
            .font(.system(size: 160, weight: .ultraLight, design: .default))
            .foregroundColor(.white)
            .minimumScaleFactor(0.3)
            .lineLimit(1)
            .scaleEffect(scoreScale)
            .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)
    }

    private func gamesWonBadge(alignment: HorizontalAlignment) -> some View {
        VStack(alignment: alignment, spacing: 3) {
            Text("\(gamesWon)")
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
