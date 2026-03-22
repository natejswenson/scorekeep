import SwiftUI

struct FootballTeamHalfView: View {
    let side: TeamSide
    let teamName: String
    let score: Int
    let isPortrait: Bool
    let canUndo: Bool
    let onTapName: () -> Void
    let onScore: (Int) -> Void
    let onUndo: () -> Void

    @State private var scoreScale: CGFloat = 1.0

    private var backgroundColor: Color {
        side == .team1 ? Color(hex: "#1E1E1E") : Color(hex: "#161616")
    }
    private let accentColor = Color(hex: "#F59E0B")

    // Football point values: 6, 3, 2, 1  (covers TD, FG, 2-pt/safety, EP)
    private let pointValues = [6, 3, 2, 1]

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
            chipGrid(columns: 2, chipHeight: 52).padding(.horizontal, 12).padding(.bottom, 14)
        }
    }

    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel.padding(.top, 20)
            Spacer()
            scoreLabel
            Spacer()
            chipRow(chipHeight: 54).padding(.horizontal, 12).padding(.bottom, 18)
        }
    }

    // MARK: - Chip Grids

    /// Portrait: all 4 scoring chips on one row, undo on its own row below
    private func chipGrid(columns: Int, chipHeight: CGFloat) -> some View {
        VStack(spacing: 8) {
            // Single row: 6pts · 3pts · 2pts · 1pt
            HStack(spacing: 8) {
                ForEach(pointValues, id: \.self) { pts in
                    ScoringChip(points: pts, accentColor: accentColor) { score(pts) }
                        .frame(height: chipHeight)
                }
            }
            // Undo — full width, slightly shorter
            UndoChip(canUndo: canUndo, action: undo)
                .frame(maxWidth: .infinity)
                .frame(height: chipHeight - 12)
        }
    }

    /// Landscape: single horizontal row — 4 scoring chips + undo
    private func chipRow(chipHeight: CGFloat) -> some View {
        HStack(spacing: 8) {
            ForEach(pointValues, id: \.self) { pts in
                ScoringChip(points: pts, accentColor: accentColor) { score(pts) }
                    .frame(height: chipHeight)
            }
            UndoChip(canUndo: canUndo, action: undo)
                .frame(height: chipHeight)
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
