import SwiftUI

struct BasketballTeamHalfView: View {
    let side: TeamSide
    let teamName: String
    let score: Int
    let isPortrait: Bool
    let lastAction: Int?
    let onTapName: () -> Void
    let onScore: (Int) -> Void
    let onUndo: () -> Void

    @State private var scoreScale: CGFloat = 1.0

    private var backgroundColor: Color {
        side == .team1 ? Color(hex: "#1E1E1E") : Color(hex: "#161616")
    }
    private let accentColor = Color(hex: "#F97316")

    private let pointValues = [3, 2, 1]

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()
            if isPortrait { portraitContent } else { landscapeContent }
        }
    }

    // MARK: - Layouts

    private var portraitContent: some View {
        VStack(spacing: 0) {
            teamNameLabel.padding(.top, 16)
            Spacer()
            scoreLabel
            Spacer()
            chipArea(isLandscape: false).padding(.horizontal, 12).padding(.bottom, 14)
        }
    }

    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel.padding(.top, 20)
            Spacer()
            scoreLabel
            Spacer()
            chipArea(isLandscape: true).padding(.horizontal, 12).padding(.bottom, 18)
        }
    }

    // MARK: - Chip Layout

    /// Portrait: 3pts + 2pts on top row, 1pt + undo on bottom row
    /// Landscape: single row of all 4
    private func chipArea(isLandscape: Bool) -> some View {
        Group {
            if isLandscape {
                HStack(spacing: 8) {
                    ForEach(pointValues, id: \.self) { pts in
                        ScoringChip(points: pts, accentColor: accentColor) { score(pts) }
                            .frame(height: 54)
                    }
                    UndoChip(canUndo: lastAction != nil, action: undo)
                        .frame(height: 54)
                }
            } else {
                VStack(spacing: 8) {
                    HStack(spacing: 8) {
                        ScoringChip(points: 3, accentColor: accentColor) { score(3) }
                            .frame(height: 52)
                        ScoringChip(points: 2, accentColor: accentColor) { score(2) }
                            .frame(height: 52)
                    }
                    HStack(spacing: 8) {
                        ScoringChip(points: 1, accentColor: accentColor) { score(1) }
                            .frame(height: 52)
                        UndoChip(canUndo: lastAction != nil, action: undo)
                            .frame(height: 52)
                    }
                }
            }
        }
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
            .font(.custom("Digital-7", size: isPortrait ? 96 : 120))
            .foregroundColor(.white)
            .minimumScaleFactor(0.3)
            .lineLimit(1)
            .scaleEffect(scoreScale)
            .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)
    }

    // MARK: - Actions

    private func score(_ points: Int) {
        onScore(points)
        scoreScale = 0.85
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func undo() {
        onUndo()
        scoreScale = 1.1
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
    }
}
