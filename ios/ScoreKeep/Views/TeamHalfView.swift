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
        .simultaneousGesture(
            LongPressGesture(minimumDuration: 0.4)
                .onEnded { _ in handleDecrement() }
        )
        .simultaneousGesture(
            TapGesture()
                .onEnded { handleIncrement() }
        )
    }

    // MARK: - Layouts

    private var portraitContent: some View {
        VStack(spacing: 0) {
            if side == .team1 {
                teamNameLabel
                    .padding(.top, 24)
                Spacer()
                scoreLabel
                Spacer()
                gamesWonRow
                    .padding(.bottom, 24)
            } else {
                gamesWonRow
                    .padding(.top, 24)
                Spacer()
                scoreLabel
                Spacer()
                teamNameLabel
                    .padding(.bottom, 24)
            }
        }
        .padding(.horizontal, 16)
    }

    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel
                .padding(.top, 20)
            Spacer()
            scoreLabel
            Spacer()
            gamesWonRow
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

    private var gamesWonRow: some View {
        VStack(spacing: 2) {
            Text("\(gamesWon)")
                .font(.system(size: 28, weight: .thin, design: .default))
                .foregroundColor(.white)
            Text("GAMES WON")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(Color(hex: "#636366"))
                .kerning(1.2)
        }
    }

    // MARK: - Interaction Handlers

    private func handleIncrement() {
        viewModel.incrementScore(team: side)
        triggerFlash(color: Color(white: 1, opacity: 0.04))
        animateScoreIn(from: 0.85)

        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.prepare()
        generator.impactOccurred()
    }

    private func handleDecrement() {
        let scoreBefore = side == .team1 ? viewModel.team1Score : viewModel.team2Score
        guard scoreBefore > 0 else { return }
        viewModel.decrementScore(team: side)
        triggerFlash(color: Color(red: 1, green: 0.231, blue: 0, opacity: 0.04))
        animateScoreIn(from: 1.1)

        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.prepare()
        generator.impactOccurred()
    }

    private func triggerFlash(color: Color) {
        flashColor = color
        withAnimation(.easeIn(duration: 0.06)) {
            flashOpacity = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
            withAnimation(.easeOut(duration: 0.06)) {
                flashOpacity = 0
            }
        }
    }

    private func animateScoreIn(from startScale: CGFloat) {
        scoreScale = startScale
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) {
            scoreScale = 1.0
        }
    }
}
