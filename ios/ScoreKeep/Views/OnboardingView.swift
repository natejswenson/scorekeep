import SwiftUI

// MARK: - Data

private struct InfoSlide {
    let title: String
    let body: String
}

// MARK: - OnboardingView

struct OnboardingView: View {
    @Binding var isPresented: Bool
    @State private var current = 0
    @Environment(\.verticalSizeClass) private var verticalSizeClass
    private var isLandscape: Bool { verticalSizeClass == .compact }

    private let slides: [InfoSlide] = [
        InfoSlide(
            title: "Tap to Score",
            body: "Tap anywhere on your team's side to add a point. Volleyball and soccer add 1. Basketball and football use your selected chip value."
        ),
        InfoSlide(
            title: "Remove a Point",
            body: "Long press anywhere on your team's side to subtract a point. For volleyball and soccer it removes 1. For basketball and football it removes the last amount you scored."
        ),
        InfoSlide(
            title: "Basketball & Football",
            body: "Tap a chip to set your point value before scoring. Your selection stays active — change it anytime by tapping a different chip."
        ),
        InfoSlide(
            title: "Volleyball Sets",
            body: "Hold the center button to end the current set and start the next one. Set wins are tracked automatically. Enable Auto-Advance in Settings to be prompted when win conditions are met."
        ),
        InfoSlide(
            title: "The Menu",
            body: "Swipe down anywhere to open the menu. Everything lives here — switch sports, start a new game (which also resets the current scores), view history, and open settings."
        ),
        InfoSlide(
            title: "Game History",
            body: "Every game is saved automatically. Open History from the menu to review past results. Volleyball matches expand to show set-by-set scores. Swipe a row left to delete it, or tap Clear All to wipe the slate."
        ),
        InfoSlide(
            title: "Settings & More",
            body: "Tap either team name on the main screen to rename it. Open Settings from the menu to choose a theme, toggle haptics, keep the screen on during play, and configure volleyball rules."
        ),
    ]

    var body: some View {
        ZStack {

            // Split gradient — portrait: top/bottom (matches real game portrait), landscape: left/right
            Group {
                if isLandscape {
                    HStack(spacing: 0) {
                        LinearGradient(colors: [Color(hex: "#3b75e9"), Color(hex: "#0e1e4a")], startPoint: .top, endPoint: .bottom)
                        LinearGradient(colors: [Color(hex: "#f32727"), Color(hex: "#460808")], startPoint: .top, endPoint: .bottom)
                    }
                } else {
                    VStack(spacing: 0) {
                        LinearGradient(colors: [Color(hex: "#3b75e9"), Color(hex: "#0e1e4a")], startPoint: .top, endPoint: .bottom)
                        LinearGradient(colors: [Color(hex: "#f32727"), Color(hex: "#460808")], startPoint: .top, endPoint: .bottom)
                    }
                }
            }
            .ignoresSafeArea()

            // Centre hairline — vertical in landscape, horizontal in portrait
            Rectangle()
                .fill(Color.white.opacity(0.12))
                .frame(width: isLandscape ? 0.5 : .infinity, height: isLandscape ? .infinity : 0.5)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                .ignoresSafeArea()
                .allowsHitTesting(false)

            // Tap-zone layer — left half goes back, right half goes forward
            HStack(spacing: 0) {
                Color.clear.contentShape(Rectangle()).onTapGesture { back() }
                Color.clear.contentShape(Rectangle()).onTapGesture { forward() }
            }
            .ignoresSafeArea()

            // Content
            VStack(spacing: 0) {

                // Close button
                HStack {
                    Spacer()
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 13, weight: .light))
                            .foregroundStyle(Color.white.opacity(0.45))
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }
                }
                .padding(.horizontal, 8)
                .padding(.top, 8)

                Spacer()

                // Illustration
                illustration(for: current)
                    .padding(.bottom, 40)

                // Title
                Text(slides[current].title)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)

                // Body
                Text(slides[current].body)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.55))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 44)
                    .padding(.top, 14)
                    .lineSpacing(5)
                    .fixedSize(horizontal: false, vertical: true)

                Spacer()

                // Slide indicator pills
                HStack(spacing: 7) {
                    ForEach(0..<slides.count, id: \.self) { i in
                        Capsule()
                            .fill(Color.white.opacity(i == current ? 0.80 : 0.20))
                            .frame(width: i == current ? 22 : 7, height: 7)
                            .animation(.easeInOut(duration: 0.18), value: current)
                    }
                }
                .padding(.bottom, 52)
            }
        }
        .preferredColorScheme(.dark)
        .gesture(
            DragGesture(minimumDistance: 40)
                .onEnded { v in
                    if v.translation.width < 0 { forward() } else { back() }
                }
        )
    }

    // MARK: - Illustrations

    @ViewBuilder
    private func illustration(for index: Int) -> some View {
        switch index {

        // 0 — Tap to Score
        case 0:
            VStack(spacing: 22) {
                Image(systemName: "hand.tap.fill")
                    .font(.system(size: 56, weight: .thin))
                    .foregroundStyle(Color.white.opacity(0.82))
                // Score label mockup
                HStack(spacing: 6) {
                    scoreDigit("7")
                    Image(systemName: "arrow.right")
                        .font(.system(size: 14, weight: .light))
                        .foregroundColor(Color.white.opacity(0.35))
                    scoreDigit("8")
                        .foregroundColor(Color(hex: "#FFD700").opacity(0.90))
                }
            }

        // 1 — Remove a Point (long press)
        case 1:
            VStack(spacing: 20) {
                // Long-press hold indicator
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.10))
                        .frame(width: 72, height: 72)
                    Circle()
                        .strokeBorder(Color.white.opacity(0.25), lineWidth: 1.5)
                        .frame(width: 72, height: 72)
                    Image(systemName: "hand.tap")
                        .font(.system(size: 28, weight: .ultraLight))
                        .foregroundColor(Color.white.opacity(0.70))
                }
                Text("hold ~0.5s")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
                    .kerning(0.8)
            }

        // 2 — Basketball & Football chips
        case 2:
            VStack(spacing: 20) {
                // Basketball row
                chipRow(values: [3, 2, 1], selected: 3, label: "BASKETBALL")
                // Football row
                chipRow(values: [6, 3, 2, 1], selected: 6, label: "FOOTBALL")
            }

        // 3 — Volleyball Sets
        case 3:
            VStack(spacing: 24) {
                // Static SetCompleteButton replica
                setCompleteButtonPreview
                // Set-win dot track
                setWinTrack(team1Wins: 1, team2Wins: 0, bestOf: 3)
            }

        // 4 — The Menu
        case 4:
            VStack(spacing: 6) {
                swipeDownHint
                    .padding(.bottom, 8)
                menuPreviewRows
            }

        // 5 — Game History
        case 5:
            VStack(spacing: 12) {
                historyPreviewCard
                historyHintRow
            }

        // 6 — Settings & More
        default:
            VStack(spacing: 20) {
                // Rename team hint
                VStack(spacing: 8) {
                    HStack(spacing: 8) {
                        Text("TEAM A")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color.white.opacity(0.55))
                            .kerning(1.5)
                        Image(systemName: "pencil")
                            .font(.system(size: 11, weight: .light))
                            .foregroundColor(Color.white.opacity(0.35))
                    }
                    Text("tap any team name to rename it")
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(Color.white.opacity(0.28))
                        .kerning(0.4)
                }
                // Settings rows hint
                settingsPreviewRows
            }
        }
    }

    // MARK: - Sub-view builders

    /// Digital-7 styled score digit
    private func scoreDigit(_ text: String) -> some View {
        Text(text)
            .font(.custom("Digital-7", size: 52))
            .foregroundColor(Color.white.opacity(0.80))
    }

    /// A horizontal row of ScoringChip instances
    private func chipRow(values: [Int], selected: Int, label: String) -> some View {
        VStack(spacing: 8) {
            Text(label)
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(Color.white.opacity(0.28))
                .kerning(1.4)
            HStack(spacing: 4) {
                ForEach(values, id: \.self) { pts in
                    ScoringChip(
                        points: pts,
                        accentColor: .white,
                        isSelected: pts == selected,
                        action: {}
                    )
                    .frame(width: 54, height: 44)
                }
            }
            .allowsHitTesting(false)
        }
    }

    /// Static replica of SetCompleteButton
    private var setCompleteButtonPreview: some View {
        ZStack {
            // Partial ring hint
            Circle()
                .trim(from: 0, to: 0.55)
                .stroke(
                    Color.white.opacity(0.55),
                    style: StrokeStyle(lineWidth: 2, lineCap: .round)
                )
                .frame(width: 76, height: 76)
                .rotationEffect(.degrees(-90))

            Circle()
                .fill(Color.white.opacity(0.12))
                .frame(width: 64, height: 64)

            Circle()
                .strokeBorder(Color.white.opacity(0.30), lineWidth: 0.8)
                .frame(width: 64, height: 64)

            VStack(spacing: 2) {
                Text("NEXT")
                    .font(.system(size: 8, weight: .semibold))
                    .foregroundColor(.white.opacity(0.70))
                    .kerning(1.4)
                Image(systemName: "checkmark")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(Color.white.opacity(0.85))
                Text("SET")
                    .font(.system(size: 8, weight: .semibold))
                    .foregroundColor(.white.opacity(0.70))
                    .kerning(1.4)
            }
        }
    }

    /// Set-win tracker dots
    private func setWinTrack(team1Wins: Int, team2Wins: Int, bestOf: Int) -> some View {
        let needed = (bestOf + 1) / 2
        return HStack(spacing: 20) {
            // Team 1 dots
            HStack(spacing: 5) {
                ForEach(0..<needed, id: \.self) { i in
                    Circle()
                        .fill(i < team1Wins ? Color.white.opacity(0.80) : Color.white.opacity(0.15))
                        .frame(width: 10, height: 10)
                }
            }
            Text("SETS")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(Color.white.opacity(0.28))
                .kerning(1.4)
            // Team 2 dots
            HStack(spacing: 5) {
                ForEach(0..<needed, id: \.self) { i in
                    Circle()
                        .fill(i < team2Wins ? Color.white.opacity(0.80) : Color.white.opacity(0.15))
                        .frame(width: 10, height: 10)
                }
            }
        }
    }

    /// Swipe-down arrow hint
    private var swipeDownHint: some View {
        VStack(spacing: 4) {
            Image(systemName: "chevron.down")
                .font(.system(size: 20, weight: .light))
                .foregroundColor(Color.white.opacity(0.50))
            Text("SWIPE DOWN")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(Color.white.opacity(0.28))
                .kerning(1.6)
        }
    }

    /// Full menu row list — matches the actual drawer order exactly
    private var menuPreviewRows: some View {
        VStack(spacing: 0) {
            menuRow(icon: "american.football",      label: "Sport",    value: "Football")
            thinDivider
            menuRow(icon: "arrow.counterclockwise", label: "New Game")
            thinDivider
            menuRow(icon: "clock",                  label: "History")
            thinDivider
            menuRow(icon: "info.circle",            label: "Help")
            thinDivider
            menuRow(icon: "gearshape",              label: "Settings")
        }
        .background(Color(hex: "#111111").opacity(0.90), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .frame(width: 220)
    }

    private func menuRow(icon: String, label: String, value: String? = nil) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .light))
                .foregroundColor(Color.white.opacity(0.50))
                .frame(width: 22)
            Text(label)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(Color.white.opacity(0.80))
            Spacer()
            if let value {
                Text(value)
                    .font(.system(size: 12, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
            }
            Image(systemName: "chevron.right")
                .font(.system(size: 10, weight: .light))
                .foregroundColor(Color.white.opacity(0.18))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    private var thinDivider: some View {
        Rectangle()
            .fill(Color.white.opacity(0.08))
            .frame(height: 0.5)
            .padding(.horizontal, 16)
    }

    /// Mock game history card
    private var historyPreviewCard: some View {
        VStack(spacing: 0) {
            // Game row
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Team A  vs  Team B")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.white)
                    Text("Today · Team A")
                        .font(.system(size: 11))
                        .foregroundColor(Color.white.opacity(0.38))
                }
                Spacer()
                Text("25 – 18")
                    .font(.system(size: 18, weight: .thin))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)

            thinDivider

            // Volleyball expanded set detail
            HStack {
                Text("Set 1")
                    .font(.system(size: 11))
                    .foregroundColor(Color.white.opacity(0.38))
                Spacer()
                Text("25 – 18")
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.60))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)

            thinDivider

            HStack {
                Text("Set 2")
                    .font(.system(size: 11))
                    .foregroundColor(Color.white.opacity(0.38))
                Spacer()
                Text("25 – 22")
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.60))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
        .background(Color(hex: "#1C1C1E"), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .frame(width: 230)
    }

    /// Swipe-to-delete hint below the history card
    private var historyHintRow: some View {
        HStack(spacing: 6) {
            Image(systemName: "arrow.left")
                .font(.system(size: 10, weight: .light))
                .foregroundColor(Color.white.opacity(0.28))
            Text("swipe left to delete · Clear All in top-right")
                .font(.system(size: 10, weight: .regular))
                .foregroundColor(Color.white.opacity(0.28))
                .kerning(0.3)
        }
    }

    /// Settings section preview
    private var settingsPreviewRows: some View {
        VStack(spacing: 0) {
            settingsRow(label: "Theme",         value: "Classic")
            thinDivider
            settingsRow(label: "Haptic Feedback", value: "On")
            thinDivider
            settingsRow(label: "Keep Screen On",  value: "On")
            thinDivider
            settingsRow(label: "Timer",           value: "Off")
        }
        .background(Color(hex: "#1C1C1E"), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .frame(width: 230)
    }

    private func settingsRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(Color.white.opacity(0.80))
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(Color.white.opacity(0.35))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 11)
    }

    // MARK: - Navigation

    private func forward() {
        if current < slides.count - 1 {
            withAnimation(.easeInOut(duration: 0.20)) { current += 1 }
        } else {
            dismiss()
        }
    }

    private func back() {
        if current > 0 {
            withAnimation(.easeInOut(duration: 0.20)) { current -= 1 }
        }
    }

    private func dismiss() {
        UserDefaults.standard.set(true, forKey: "hasSeenOnboarding")
        isPresented = false
    }
}
