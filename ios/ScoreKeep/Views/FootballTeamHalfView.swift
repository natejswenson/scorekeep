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
    private let pointValues = [6, 3, 2, 1]

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()
            if isPortrait { portraitContent } else { landscapeContent }
        }
    }

    // MARK: - Layouts

    /// Portrait: team name pinned top, score + chips grouped together and centered in remaining space.
    private var portraitContent: some View {
        VStack(spacing: 0) {
            teamNameLabel
                .padding(.top, 16)
            Spacer(minLength: 0)
            // Score and chips as one cohesive unit
            VStack(spacing: 14) {
                scoreLabel
                chipsPortrait
                    .padding(.horizontal, 12)
            }
            Spacer(minLength: 0)
        }
    }

    /// Landscape: team name top, score + chips centered vertically.
    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel
                .padding(.top, 20)
            Spacer(minLength: 0)
            VStack(spacing: 12) {
                scoreLabel
                chipsLandscape
                    .padding(.horizontal, 10)
            }
            Spacer(minLength: 0)
        }
    }

    // MARK: - Chip Arrangements

    /// Portrait: all 4 scoring chips on one row, undo on its own full-width row below.
    private var chipsPortrait: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                ForEach(pointValues, id: \.self) { pts in
                    ScoringChip(points: pts, accentColor: accentColor) { score(pts) }
                        .frame(height: 50)
                }
            }
            UndoChip(canUndo: canUndo, action: undo)
                .frame(maxWidth: .infinity)
                .frame(height: 38)
        }
    }

    /// Landscape: all 4 scoring chips + undo in a single horizontal row.
    private var chipsLandscape: some View {
        HStack(spacing: 8) {
            ForEach(pointValues, id: \.self) { pts in
                ScoringChip(points: pts, accentColor: accentColor) { score(pts) }
                    .frame(height: 52)
            }
            UndoChip(canUndo: canUndo, action: undo)
                .frame(height: 52)
        }
    }

    // MARK: - Subviews

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
            .font(.custom("Digital-7", size: isPortrait ? 96 : 110))
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
