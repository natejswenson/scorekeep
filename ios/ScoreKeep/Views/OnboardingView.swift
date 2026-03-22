import SwiftUI

struct OnboardingView: View {
    @Binding var isPresented: Bool
    @State private var currentSlide = 0

    private let slides: [(title: String, subtitle: String)] = [
        (
            "Tap to Score",
            "Tap anywhere on your team's half\nof the screen to add a point."
        ),
        (
            "Long Press to Subtract",
            "Made a mistake? Hold your team's half\nfor 1 second to remove a point."
        ),
        (
            "Reset the Set",
            "Hold the center button to end a set.\nScores reset — you can Undo if needed."
        ),
        (
            "History & New Game",
            "Tap the clock to view past games and start a new one.\nTap your team name to rename it."
        )
    ]

    var body: some View {
        ZStack {
            Color(hex: "#111111").ignoresSafeArea()

            // Slide content with swipe gesture
            ZStack {
                switch currentSlide {
                case 0:
                    OnboardingSlide(
                        animation: TapToScoreAnimation(),
                        title: slides[0].title,
                        subtitle: slides[0].subtitle,
                        slideIndex: 0,
                        totalSlides: slides.count,
                        onSkip: dismiss,
                        onDone: dismiss,
                        onNext: { advance() },
                        onBack: { }
                    )
                    .transition(slideTransition(forward: true))
                case 1:
                    OnboardingSlide(
                        animation: LongPressAnimation(),
                        title: slides[1].title,
                        subtitle: slides[1].subtitle,
                        slideIndex: 1,
                        totalSlides: slides.count,
                        onSkip: dismiss,
                        onDone: dismiss,
                        onNext: { advance() },
                        onBack: { retreat() }
                    )
                    .transition(slideTransition(forward: true))
                case 2:
                    OnboardingSlide(
                        animation: ResetAnimation(),
                        title: slides[2].title,
                        subtitle: slides[2].subtitle,
                        slideIndex: 2,
                        totalSlides: slides.count,
                        onSkip: dismiss,
                        onDone: dismiss,
                        onNext: { advance() },
                        onBack: { retreat() }
                    )
                    .transition(slideTransition(forward: true))
                default:
                    OnboardingSlide(
                        animation: HistoryAndNamesAnimation(),
                        title: slides[3].title,
                        subtitle: slides[3].subtitle,
                        slideIndex: 3,
                        totalSlides: slides.count,
                        onSkip: dismiss,
                        onDone: dismiss,
                        onNext: dismiss,
                        onBack: { retreat() }
                    )
                    .transition(slideTransition(forward: true))
                }
            }
            .animation(.easeInOut(duration: 0.3), value: currentSlide)
        }
        .preferredColorScheme(.dark)
        // Swipe gesture for navigation
        .gesture(
            DragGesture(minimumDistance: 40)
                .onEnded { value in
                    if value.translation.width < 0 { advance() }
                    else if value.translation.width > 0 { retreat() }
                }
        )
    }

    // MARK: - Navigation

    private func advance() {
        if currentSlide < slides.count - 1 {
            withAnimation(.easeInOut(duration: 0.3)) { currentSlide += 1 }
        } else {
            dismiss()
        }
    }

    private func retreat() {
        if currentSlide > 0 {
            withAnimation(.easeInOut(duration: 0.3)) { currentSlide -= 1 }
        }
    }

    private func dismiss() {
        UserDefaults.standard.set(true, forKey: "hasSeenOnboarding")
        isPresented = false
    }

    private func slideTransition(forward: Bool) -> AnyTransition {
        .asymmetric(
            insertion: .move(edge: forward ? .trailing : .leading),
            removal: .move(edge: forward ? .leading : .trailing)
        )
    }
}
