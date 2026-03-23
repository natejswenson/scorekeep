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

    private let slides: [InfoSlide] = [
        InfoSlide(
            title: "Tap to Score",
            body: "Tap anywhere on your team's side to add a point. Volleyball and soccer add 1. Basketball and football use your selected chip value."
        ),
        InfoSlide(
            title: "Remove a Point",
            body: "Tap the − button at the bottom of your team's side to subtract a point. It fades out when the score is already 0."
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
            title: "Reset Scores",
            body: "For all other sports, hold the center button until the ring fills to reset both scores. An undo option appears for 4 seconds if you change your mind."
        ),
        InfoSlide(
            title: "Switch Sports",
            body: "Tap the sport icon at the top center of the screen to switch between Volleyball, Basketball, Football, and Soccer."
        ),
        InfoSlide(
            title: "Menu & Settings",
            body: "Swipe down anywhere to open the menu. Start a New Game, view History, enable a Timer, or open Settings to pick a theme, rename teams, and more."
        ),
    ]

    var body: some View {
        ZStack {

            // Split gradient matches the live game background
            HStack(spacing: 0) {
                LinearGradient(
                    colors: [Color(hex: "#3b75e9"), Color(hex: "#0e1e4a")],
                    startPoint: .top, endPoint: .bottom
                )
                LinearGradient(
                    colors: [Color(hex: "#f32727"), Color(hex: "#460808")],
                    startPoint: .top, endPoint: .bottom
                )
            }
            .ignoresSafeArea()

            // Centre hairline
            Rectangle()
                .fill(Color.white.opacity(0.12))
                .frame(width: 0.5)
                .frame(maxWidth: .infinity, alignment: .center)
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

        // 1 — Remove a Point
        case 1:
            VStack(spacing: 28) {
                // Actual − button replica
                decrementButtonPreview
                // Caption
                Text("appears at the bottom of each side")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
                    .kerning(0.4)
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

        // 4 — Reset Scores
        case 4:
            VStack(spacing: 24) {
                // Static ResetButton replica (ring partially filled to hint "hold")
                resetButtonPreview(ringProgress: 0.65)
                // Undo toast preview
                undoToastPreview
            }

        // 5 — Switch Sports
        case 5:
            VStack(spacing: 18) {
                // Sport switcher button replica (glowing icon at top)
                sportSwitcherPreview
                Text("tap the icon at the top of the screen")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
                    .kerning(0.4)
                    .multilineTextAlignment(.center)
            }

        // 6 — Menu & Settings
        default:
            VStack(spacing: 6) {
                swipeDownHint
                    .padding(.bottom, 8)
                menuPreviewRows
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

    /// Replica of the − decrement button
    private var decrementButtonPreview: some View {
        ZStack {
            Circle()
                .strokeBorder(Color.white.opacity(0.28), lineWidth: 1)
            Text("−")
                .font(.system(size: 22, weight: .light))
                .foregroundColor(Color.white.opacity(0.45))
        }
        .frame(width: 52, height: 52)
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

    /// Static reset button with ring partially filled
    private func resetButtonPreview(ringProgress: CGFloat) -> some View {
        ZStack {
            Circle()
                .trim(from: 0, to: ringProgress)
                .stroke(
                    Color.white.opacity(0.60),
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

            Image(systemName: "arrow.counterclockwise")
                .font(.system(size: 22, weight: .light))
                .foregroundStyle(Color.white.opacity(0.80))
        }
    }

    /// Undo toast replica (matches UndoToastView)
    private var undoToastPreview: some View {
        HStack(spacing: 8) {
            Image(systemName: "arrow.uturn.backward")
                .font(.system(size: 13, weight: .medium))
            Text("Undo Reset")
                .font(.system(size: 13, weight: .medium))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 18)
        .padding(.vertical, 10)
        .background(
            Capsule()
                .fill(Color(hex: "#2C2C2E"))
                .overlay(
                    Capsule().strokeBorder(Color(hex: "#3A3A3C"), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.4), radius: 12, x: 0, y: 4)
        )
    }

    /// Sport switcher button replica (glowing, as seen at top-center of game)
    private var sportSwitcherPreview: some View {
        ZStack {
            Circle()
                .fill(Color.white.opacity(0.08))
                .frame(width: 60, height: 60)
            Circle()
                .strokeBorder(Color.white.opacity(0.18), lineWidth: 0.8)
                .frame(width: 60, height: 60)
            Image(systemName: "volleyball.fill")
                .font(.system(size: 24, weight: .light))
                .foregroundStyle(Color.white)
                .shadow(color: Color.white.opacity(0.6), radius: 8)
                .shadow(color: Color.white.opacity(0.3), radius: 20)
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

    /// Mini menu row list
    private var menuPreviewRows: some View {
        VStack(spacing: 0) {
            menuRow(icon: "arrow.counterclockwise", label: "New Game")
            thinDivider
            menuRow(icon: "clock",                  label: "History")
            thinDivider
            menuRow(icon: "timer",                  label: "Timer")
            thinDivider
            menuRow(icon: "gearshape",              label: "Settings")
        }
        .background(Color(hex: "#111111").opacity(0.85), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .frame(width: 200)
    }

    private func menuRow(icon: String, label: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .light))
                .foregroundColor(Color.white.opacity(0.50))
                .frame(width: 22)
            Text(label)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(Color.white.opacity(0.80))
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 13)
    }

    private var thinDivider: some View {
        Rectangle()
            .fill(Color.white.opacity(0.08))
            .frame(height: 0.5)
            .padding(.horizontal, 16)
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
