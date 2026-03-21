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
                // Frosted glass circle — picks up the hairline separator color behind it
                Circle()
                    .fill(.ultraThinMaterial)
                    .frame(width: 52, height: 52)

                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 17, weight: .light))
                    .foregroundStyle(.white.opacity(0.7))
            }
        }
        .buttonStyle(ResetButtonStyle())
    }
}

private struct ResetButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.88 : 1.0)
            .opacity(configuration.isPressed ? 0.7 : 1.0)
            .animation(.spring(response: 0.18, dampingFraction: 0.65), value: configuration.isPressed)
    }
}
