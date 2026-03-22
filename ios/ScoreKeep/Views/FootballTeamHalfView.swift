import SwiftUI

struct FootballTeamHalfView: View {
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
    private let accentColor = Color(hex: "#F59E0B")  // amber

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()

            if isPortrait {
                portraitContent
            } else {
                landscapeContent
            }
        }
    }

    // MARK: - Layouts

    private var portraitContent: some View {
        VStack(spacing: 0) {
            teamNameLabel.padding(.top, 16)
            Spacer()
            scoreLabel
            Spacer()
            actionGrid.padding(.bottom, 14)
        }
    }

    private var landscapeContent: some View {
        VStack(spacing: 0) {
            teamNameLabel.padding(.top, 20)
            Spacer()
            scoreLabel
            Spacer()
            actionGrid.padding(.bottom, 18)
        }
        .padding(.horizontal, 10)
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

    private var actionGrid: some View {
        VStack(spacing: 7) {
            HStack(spacing: 7) {
                actionButton(label: "TD",  points: 6)
                actionButton(label: "FG",  points: 3)
            }
            HStack(spacing: 7) {
                actionButton(label: "EP",  points: 1)
                actionButton(label: "2PT", points: 2)
            }
            HStack(spacing: 7) {
                actionButton(label: "SAF", points: 2)
                undoButton
            }
        }
        .padding(.horizontal, 12)
    }

    private func actionButton(label: String, points: Int) -> some View {
        Button {
            onScore(points)
            animateScore(increment: true)
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } label: {
            Text(label)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(accentColor)
                .frame(maxWidth: .infinity)
                .frame(height: 40)
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color(hex: "#242424"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .strokeBorder(accentColor.opacity(0.3), lineWidth: 0.6)
                        )
                )
        }
        .buttonStyle(.plain)
    }

    private var undoButton: some View {
        let canUndo = lastAction != nil
        return Button {
            guard canUndo else { return }
            onUndo()
            animateScore(increment: false)
        } label: {
            Text("Undo")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(canUndo ? Color(hex: "#8E8E93") : Color(hex: "#3A3A3C"))
                .frame(maxWidth: .infinity)
                .frame(height: 40)
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color(hex: "#242424"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .strokeBorder(
                                    canUndo ? Color(hex: "#8E8E93").opacity(0.3) : Color(hex: "#242424"),
                                    lineWidth: 0.6
                                )
                        )
                )
        }
        .buttonStyle(.plain)
        .disabled(!canUndo)
    }

    private func animateScore(increment: Bool) {
        scoreScale = increment ? 0.85 : 1.1
        withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) {
            scoreScale = 1.0
        }
    }
}
