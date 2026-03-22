import SwiftUI

struct BasketballTeamHalfView: View {
    let side: TeamSide
    let teamName: String
    let score: Int
    let isPortrait: Bool
    let canUndo: Bool
    let onTapName: () -> Void
    let onScore: (Int) -> Void
    let onUndo: () -> Void

    @State private var scoreScale: CGFloat = 1.0
    @State private var selectedPoints: Int = 3
    @State private var lastTapTime: Date = .distantPast

    private let tapDebounce: TimeInterval = 0.20

    private var backgroundColor: Color {
        side == .team1 ? Color(hex: "#1E1E1E") : Color(hex: "#161616")
    }
    private let accentColor = Color(hex: "#F97316")
    private let pointValues = [3, 2, 1]

    // Fixed heights — chips stay compact selectors; score claims everything else.
    private let nameHeight: CGFloat    = 40
    private let chipRowHeight: CGFloat = 32
    private let undoRowHeight: CGFloat = 26
    private let chipSpacing: CGFloat   = 6
    private let bottomPad: CGFloat     = 10

    private var totalChipsHeight: CGFloat {
        chipRowHeight + chipSpacing + undoRowHeight + bottomPad
    }

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()

            GeometryReader { geo in
                let scoreSize = dynamicFontSize(for: geo.size.height)

                VStack(spacing: 0) {
                    // Team name — fixed top
                    teamNameLabel
                        .frame(height: nameHeight)

                    // Score — expands to fill all remaining space
                    Text("\(score)")
                        .font(.custom("Digital-7", size: scoreSize))
                        .foregroundColor(.white)
                        .minimumScaleFactor(0.2)
                        .lineLimit(1)
                        .scaleEffect(scoreScale)
                        .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)

                    // Chips — compact selectors at bottom
                    chipsView
                        .padding(.horizontal, 12)
                        .frame(height: totalChipsHeight)
                }
            }
        }
        // Tap anywhere on this half to score with the selected point value
        .onTapGesture {
            let now = Date()
            guard now.timeIntervalSince(lastTapTime) >= tapDebounce else { return }
            lastTapTime = now
            scoreAction(selectedPoints)
        }
    }

    // MARK: - Dynamic Font Size

    private func dynamicFontSize(for availableHeight: CGFloat) -> CGFloat {
        let scoreSpace = availableHeight - nameHeight - totalChipsHeight
        return max(48, scoreSpace * 0.80)
    }

    // MARK: - Chip Views

    private var chipsView: some View {
        VStack(spacing: chipSpacing) {
            // Selector chips row
            HStack(spacing: 8) {
                ForEach(pointValues, id: \.self) { pts in
                    ScoringChip(
                        points: pts,
                        accentColor: accentColor,
                        isSelected: selectedPoints == pts
                    ) {
                        selectedPoints = pts
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                    .frame(height: chipRowHeight)
                }
            }
            // Undo — full width
            UndoChip(canUndo: canUndo, action: undoAction)
                .frame(maxWidth: .infinity)
                .frame(height: undoRowHeight)
        }
    }

    // MARK: - Subviews

    private var teamNameLabel: some View {
        Text(teamName)
            .font(.system(size: 15, weight: .regular))
            .foregroundColor(Color(hex: "#8E8E93"))
            .onTapGesture { onTapName() }
            .padding(.top, 10)
            .contentShape(Rectangle())
    }

    // MARK: - Actions

    private func scoreAction(_ points: Int) {
        onScore(points)
        scoreScale = 0.88
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func undoAction() {
        onUndo()
        scoreScale = 1.08
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
    }
}
