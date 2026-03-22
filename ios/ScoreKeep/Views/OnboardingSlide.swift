import SwiftUI

struct OnboardingSlide<Animation: View>: View {
    let animation: Animation
    let title: String
    let subtitle: String
    let slideIndex: Int    // 0-based
    let totalSlides: Int
    let onSkip: () -> Void
    let onDone: () -> Void
    let onNext: () -> Void
    let onBack: () -> Void

    var isLastSlide: Bool { slideIndex == totalSlides - 1 }

    var body: some View {
        GeometryReader { geo in
            ZStack {
                Color(hex: "#111111").ignoresSafeArea()

                VStack(spacing: 0) {
                    // Skip / Done — top right
                    HStack {
                        Spacer()
                        Button(isLastSlide ? "Done" : "Skip") {
                            if isLastSlide { onDone() } else { onSkip() }
                        }
                        .font(.system(size: 15, weight: .regular))
                        .foregroundStyle(Color(hex: "#636366"))
                        .padding(.trailing, 24)
                        .padding(.top, 16)
                    }

                    // Animated scene — upper portion of screen
                    animation
                        .frame(maxWidth: .infinity)
                        .frame(height: geo.size.height * 0.52)

                    Spacer()

                    // Title
                    Text(title)
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                        .padding(.top, 24)

                    // Subtitle
                    Text(subtitle)
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(Color(hex: "#8E8E93"))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 36)
                        .padding(.top, 10)
                        .lineSpacing(3)

                    Spacer()

                    // Dot indicator
                    HStack(spacing: 8) {
                        ForEach(0..<totalSlides, id: \.self) { i in
                            Circle()
                                .fill(i == slideIndex ? Color.white : Color(hex: "#3A3A3C"))
                                .frame(width: 7, height: 7)
                                .animation(.easeInOut(duration: 0.2), value: slideIndex)
                        }
                    }
                    .padding(.bottom, 40)
                }

                // Tap zones — invisible overlays for navigation
                HStack(spacing: 0) {
                    // Left 40% → go back
                    Color.clear
                        .contentShape(Rectangle())
                        .onTapGesture { if slideIndex > 0 { onBack() } }
                        .frame(width: geo.size.width * 0.4)

                    // Right 60% → forward / done
                    Color.clear
                        .contentShape(Rectangle())
                        .onTapGesture { if isLastSlide { onDone() } else { onNext() } }
                        .frame(maxWidth: .infinity)
                }
                .ignoresSafeArea()
            }
        }
    }
}
