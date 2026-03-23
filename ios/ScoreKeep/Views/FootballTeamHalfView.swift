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
    /// When non-nil (landscape), chips are hidden and this value is used for tap-anywhere scoring.
    var externalSelectedPoints: Int? = nil

    @State private var scoreScale: CGFloat = 1.0
    @State private var _selectedPoints: Int = 6
    @State private var lastTapTime: Date = .distantPast
    @State private var pressStartTime: Date?
    @State private var flashOpacity: Double = 0

    private let tapDebounce: TimeInterval = 0.20
    private let longPressDuration: TimeInterval = 0.45

    private var showChips: Bool { externalSelectedPoints == nil }
    private var activeSelectedPoints: Int { externalSelectedPoints ?? _selectedPoints }

    private var backgroundColor: LinearGradient {
        let theme = SettingsManager.shared.activeTheme
        return side == .team1
            ? LinearGradient(colors: [Color(hex: theme.team1Top), Color(hex: theme.team1Bottom)], startPoint: .top, endPoint: .bottom)
            : LinearGradient(colors: [Color(hex: theme.team2Top), Color(hex: theme.team2Bottom)], startPoint: .top, endPoint: .bottom)
    }
    private let accentColor = Color(hex: "#FB923C")
    private let pointValues = [6, 3, 2, 1]

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

            Color(red: 1, green: 0.231, blue: 0, opacity: flashOpacity)
                .ignoresSafeArea()
                .allowsHitTesting(false)

            GeometryReader { geo in
                let scoreSize = dynamicFontSize(for: geo.size.height)

                VStack(spacing: 0) {
                    teamNameLabel
                        .frame(height: nameHeight)

                    Text("\(score)")
                        .font(.custom("Digital-7", size: scoreSize))
                        .foregroundColor(.white)
                        .minimumScaleFactor(0.2)
                        .lineLimit(1)
                        .scaleEffect(scoreScale)
                        .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)

                    if showChips {
                        chipsView
                            .padding(.horizontal, 12)
                            .frame(height: totalChipsHeight)
                    }
                }
            }
        }
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if pressStartTime == nil { pressStartTime = Date() }
                }
                .onEnded { _ in
                    defer { pressStartTime = nil }
                    let elapsed = pressStartTime.map { Date().timeIntervalSince($0) } ?? 0
                    if elapsed >= longPressDuration {
                        handleLongPress()
                    } else {
                        handleTap()
                    }
                }
        )
    }

    // MARK: - Dynamic Font Size

    private func dynamicFontSize(for availableHeight: CGFloat) -> CGFloat {
        let chipsH = showChips ? totalChipsHeight : 0
        let scoreSpace = availableHeight - nameHeight - chipsH
        return max(48, scoreSpace * 0.80)
    }

    // MARK: - Chip Views

    private var chipsView: some View {
        VStack(spacing: chipSpacing) {
            HStack(spacing: 8) {
                ForEach(pointValues, id: \.self) { pts in
                    ScoringChip(
                        points: pts,
                        accentColor: accentColor,
                        isSelected: _selectedPoints == pts
                    ) {
                        _selectedPoints = pts
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                    .frame(height: chipRowHeight)
                }
            }
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

    private func handleTap() {
        let now = Date()
        guard now.timeIntervalSince(lastTapTime) >= tapDebounce else { return }
        lastTapTime = now
        scoreAction(activeSelectedPoints)
    }

    private func handleLongPress() {
        undoAction()
        withAnimation(.easeIn(duration: 0.06)) { flashOpacity = 0.08 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
            withAnimation(.easeOut(duration: 0.1)) { flashOpacity = 0 }
        }
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

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
