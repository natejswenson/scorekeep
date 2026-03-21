import SwiftUI

struct ResetButton: View {
    let action: () -> Void
    @State private var isPressed = false

    var body: some View {
        Button {
            let generator = UINotificationFeedbackGenerator()
            generator.prepare()
            generator.notificationOccurred(.warning)
            action()
        } label: {
            ZStack {
                Circle()
                    .fill(Color(hex: isPressed ? "#3A3A3C" : "#2C2C2E"))
                    .frame(width: 56, height: 56)
                    .overlay(
                        Circle()
                            .strokeBorder(Color(hex: "#3A3A3C"), lineWidth: 1)
                    )
                    .shadow(color: Color.black.opacity(0.4), radius: 8, x: 0, y: 2)
                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 20, weight: .regular))
                    .foregroundColor(Color(hex: "#AEAEB2"))
            }
        }
        .buttonStyle(ResetButtonStyle())
    }
}

private struct ResetButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.92 : 1.0)
            .animation(.spring(response: 0.2, dampingFraction: 0.6), value: configuration.isPressed)
    }
}
