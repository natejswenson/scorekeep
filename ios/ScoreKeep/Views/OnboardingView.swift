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
            body: "Tap anywhere on your team's half to add a point. Long press to subtract one."
        ),
        InfoSlide(
            title: "Undo Last Point",
            body: "An undo button appears after every score. Tap it to instantly reverse the last point."
        ),
        InfoSlide(
            title: "Basketball",
            body: "Tap a chip to pick your point value — 3, 2, or 1 — then tap your side to score."
        ),
        InfoSlide(
            title: "Football",
            body: "Select a chip — 6, 3, 2, or 1 — then tap your side. The chip stays active until you change it."
        ),
        InfoSlide(
            title: "Volleyball Sets",
            body: "Sets are tracked automatically. Enable Auto-Advance in Settings to prompt for the next set when win conditions are met."
        ),
        InfoSlide(
            title: "Switch Sports",
            body: "Tap the sport icon at the top center to switch between Volleyball, Basketball, Football, and Soccer."
        ),
        InfoSlide(
            title: "Menu & More",
            body: "Swipe down from the top to open the menu. Start a new game, view history, set a timer, or adjust settings."
        ),
        InfoSlide(
            title: "Personalize",
            body: "Tap a team name to rename it. Open Settings to choose a theme, toggle haptics, and keep the screen on during play."
        ),
    ]

    var body: some View {
        ZStack {

            // App-matching split gradient background
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

            // Hairline centre separator
            Rectangle()
                .fill(Color.white.opacity(0.12))
                .frame(width: 0.5)
                .frame(maxWidth: .infinity, alignment: .center)
                .ignoresSafeArea()
                .allowsHitTesting(false)

            // Tap zones — behind content so the close button stays active
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
                            .foregroundStyle(Color.white.opacity(0.50))
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }
                }
                .padding(.horizontal, 8)
                .padding(.top, 8)

                Spacer()

                // Illustration
                illustration(for: current)
                    .padding(.bottom, 36)

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

                // Pill indicators
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

        // Tap to Score
        case 0:
            VStack(spacing: 20) {
                Image(systemName: "hand.tap.fill")
                    .font(.system(size: 54, weight: .thin))
                    .foregroundStyle(Color.white.opacity(0.82))
                HStack(spacing: 24) {
                    gestureTag(icon: "hand.tap", label: "+1")
                    gestureTag(icon: "hand.point.up.left", label: "−1", isHold: true)
                }
            }

        // Undo
        case 1:
            VStack(spacing: 16) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.white.opacity(0.10))
                        .frame(width: 180, height: 44)
                    HStack(spacing: 10) {
                        Image(systemName: "arrow.uturn.backward")
                            .font(.system(size: 15, weight: .light))
                            .foregroundColor(Color.white.opacity(0.70))
                        Text("Undo Last Point")
                            .font(.system(size: 14, weight: .regular))
                            .foregroundColor(Color.white.opacity(0.80))
                    }
                }
                Text("Appears for 4 seconds after scoring")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
                    .kerning(0.5)
            }

        // Basketball
        case 2:
            HStack(spacing: 12) {
                BasketballHoopChip(points: 3, isSelected: true,  action: {})
                BasketballHoopChip(points: 2, isSelected: false, action: {})
                BasketballHoopChip(points: 1, isSelected: false, action: {})
                inlineUndoPreview
            }
            .allowsHitTesting(false)

        // Football
        case 3:
            HStack(spacing: 10) {
                FootballGoalpostChip(points: 6, isSelected: true,  action: {})
                FootballGoalpostChip(points: 3, isSelected: false, action: {})
                FootballGoalpostChip(points: 2, isSelected: false, action: {})
                FootballGoalpostChip(points: 1, isSelected: false, action: {})
                inlineUndoPreview
            }
            .allowsHitTesting(false)

        // Volleyball sets
        case 4:
            VStack(spacing: 18) {
                Image(systemName: "volleyball.fill")
                    .font(.system(size: 46, weight: .thin))
                    .foregroundStyle(Color.white.opacity(0.82))
                HStack(spacing: 10) {
                    setDot(label: "Set 1", filled: true)
                    setDot(label: "Set 2", filled: true)
                    setDot(label: "Set 3", filled: false)
                }
            }

        // Switch Sports
        case 5:
            VStack(spacing: 20) {
                HStack(spacing: 36) {
                    sportIcon("volleyball.fill",        label: "Volleyball")
                    sportIcon("basketball.fill",        label: "Basketball")
                }
                HStack(spacing: 36) {
                    sportIcon("american.football.fill", label: "Football")
                    sportIcon("soccerball",             label: "Soccer")
                }
            }

        // Menu
        case 6:
            VStack(spacing: 16) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 34, weight: .thin))
                    .foregroundStyle(Color.white.opacity(0.82))
                VStack(spacing: 8) {
                    menuPreviewRow(icon: "arrow.counterclockwise", label: "New Game")
                    menuPreviewRow(icon: "clock",                  label: "History")
                    menuPreviewRow(icon: "timer",                  label: "Timer")
                    menuPreviewRow(icon: "gearshape",              label: "Settings")
                }
            }

        // Personalize
        default:
            VStack(spacing: 20) {
                HStack(spacing: 28) {
                    VStack(spacing: 8) {
                        Image(systemName: "pencil")
                            .font(.system(size: 32, weight: .thin))
                            .foregroundStyle(Color.white.opacity(0.82))
                        Text("Rename Teams")
                            .font(.system(size: 11, weight: .regular))
                            .foregroundColor(Color.white.opacity(0.40))
                            .kerning(0.8)
                    }
                    VStack(spacing: 8) {
                        Image(systemName: "paintpalette")
                            .font(.system(size: 32, weight: .thin))
                            .foregroundStyle(Color.white.opacity(0.82))
                        Text("Themes")
                            .font(.system(size: 11, weight: .regular))
                            .foregroundColor(Color.white.opacity(0.40))
                            .kerning(0.8)
                    }
                    VStack(spacing: 8) {
                        Image(systemName: "iphone.and.arrow.forward.inward")
                            .font(.system(size: 32, weight: .thin))
                            .foregroundStyle(Color.white.opacity(0.82))
                        Text("Screen On")
                            .font(.system(size: 11, weight: .regular))
                            .foregroundColor(Color.white.opacity(0.40))
                            .kerning(0.8)
                    }
                }
            }
        }
    }

    // MARK: - Sub-views

    private func gestureTag(icon: String, label: String, isHold: Bool = false) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .light))
                .foregroundColor(Color.white.opacity(0.55))
            Text(label)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color.white.opacity(0.75))
            if isHold {
                Text("hold")
                    .font(.system(size: 10, weight: .regular))
                    .foregroundColor(Color.white.opacity(0.30))
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 7)
        .background(Color.white.opacity(0.08), in: Capsule())
    }

    private func setDot(label: String, filled: Bool) -> some View {
        VStack(spacing: 6) {
            Circle()
                .fill(filled ? Color.white.opacity(0.80) : Color.white.opacity(0.15))
                .frame(width: 18, height: 18)
            Text(label)
                .font(.system(size: 10, weight: .regular))
                .foregroundColor(Color.white.opacity(0.35))
        }
    }

    private func menuPreviewRow(icon: String, label: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 13, weight: .light))
                .foregroundColor(Color.white.opacity(0.50))
                .frame(width: 20)
            Text(label)
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(Color.white.opacity(0.65))
            Spacer()
        }
        .frame(width: 160)
    }

    /// Static undo circle preview matching InlineUndoButton appearance.
    private var inlineUndoPreview: some View {
        ZStack {
            Circle()
                .strokeBorder(Color.white.opacity(0.50), lineWidth: 1.0)
            Image(systemName: "arrow.uturn.backward")
                .font(.system(size: 13, weight: .light))
                .foregroundColor(Color.white.opacity(0.60))
        }
        .frame(width: 34, height: 34)
    }

    private func sportIcon(_ name: String, label: String) -> some View {
        VStack(spacing: 8) {
            Image(systemName: name)
                .font(.system(size: 34, weight: .thin))
                .foregroundStyle(Color.white.opacity(0.82))
            Text(label)
                .font(.system(size: 11, weight: .regular))
                .foregroundColor(Color.white.opacity(0.40))
                .kerning(1.2)
        }
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
