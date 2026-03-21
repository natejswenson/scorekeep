import SwiftUI

struct ResetButton: View {
    let action: () -> Void

    var body: some View {
        Button {
            let generator = UINotificationFeedbackGenerator()
            generator.prepare()
            generator.notificationOccurred(.warning)
            action()
        } label: {
            ZStack {
                // Thin gradient ring — no fill, just the stroke
                Circle()
                    .strokeBorder(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.45),
                                Color.white.opacity(0.08)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 0.75
                    )
                    .frame(width: 54, height: 54)

                // Counterclockwise arrow — ultralight, subtle
                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 15, weight: .ultraLight))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.65),
                                Color.white.opacity(0.3)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
            }
        }
        .buttonStyle(ResetButtonStyle())
    }
}

private struct ResetButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.84 : 1.0)
            .opacity(configuration.isPressed ? 0.5 : 1.0)
            .animation(.spring(response: 0.16, dampingFraction: 0.6), value: configuration.isPressed)
    }
}
