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
                // Subtle dark fill so button reads against both halves
                Circle()
                    .fill(Color.black.opacity(0.55))
                    .frame(width: 64, height: 64)

                // Thin gradient ring — blue/purple tint
                Circle()
                    .strokeBorder(
                        LinearGradient(
                            colors: [
                                Color(hex: "#818CF8").opacity(0.55),
                                Color(hex: "#A78BFA").opacity(0.15)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 0.8
                    )
                    .frame(width: 64, height: 64)

                // Icon with layered glow
                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 22, weight: .light))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [
                                Color(hex: "#C4B5FD"), // violet-300
                                Color(hex: "#818CF8")  // indigo-400
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    // Inner tight glow
                    .shadow(color: Color(hex: "#818CF8").opacity(0.95), radius: 6, x: 0, y: 0)
                    // Outer diffuse glow
                    .shadow(color: Color(hex: "#A78BFA").opacity(0.6), radius: 18, x: 0, y: 0)
            }
        }
        .buttonStyle(ResetButtonStyle())
    }
}

private struct ResetButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.86 : 1.0)
            .opacity(configuration.isPressed ? 0.6 : 1.0)
            .animation(.spring(response: 0.16, dampingFraction: 0.6), value: configuration.isPressed)
    }
}
