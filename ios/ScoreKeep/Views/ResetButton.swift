import SwiftUI

struct ResetButton: View {
    let action: () -> Void

    @State private var holdProgress: CGFloat = 0
    @State private var isHolding: Bool = false
    @GestureState private var isPressed: Bool = false

    private let holdDuration: TimeInterval = 1.2

    var body: some View {
        ZStack {
            // Progress ring — sits outside the 64pt button circle
            Circle()
                .trim(from: 0, to: holdProgress)
                .stroke(
                    LinearGradient(
                        colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                        startPoint: .top,
                        endPoint: .bottom
                    ),
                    style: StrokeStyle(lineWidth: 2, lineCap: .round)
                )
                .frame(width: 76, height: 76) // 64pt button + 4pt gap + 2pt stroke + 2pt gap + 4pt
                .rotationEffect(.degrees(-90))

            // Button body
            ZStack {
                Circle()
                    .fill(Color.black.opacity(0.55))
                    .frame(width: 64, height: 64)

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

                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 22, weight: .light))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .shadow(color: Color(hex: "#818CF8").opacity(0.95), radius: 6, x: 0, y: 0)
                    .shadow(color: Color(hex: "#A78BFA").opacity(0.6), radius: 18, x: 0, y: 0)
                    // Scale down slightly while holding to indicate active state
                    .scaleEffect(isHolding ? 0.88 : 1.0)
                    .animation(.easeInOut(duration: 0.15), value: isHolding)
            }
        }
        .gesture(
            LongPressGesture(minimumDuration: holdDuration)
                .updating($isPressed) { value, state, _ in state = value }
                .onEnded { _ in fireReset() }
        )
        .onChange(of: isPressed) { _, pressing in
            if pressing {
                startHold()
            } else {
                cancelHold()
            }
        }
    }

    // MARK: - Hold Lifecycle

    private func startHold() {
        isHolding = true
        // Light haptic to confirm press registered
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        withAnimation(.linear(duration: holdDuration)) {
            holdProgress = 1.0
        }
    }

    private func cancelHold() {
        guard isHolding else { return }
        isHolding = false
        withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
            holdProgress = 0
        }
    }

    private func fireReset() {
        isHolding = false
        // Snap ring to full then retract
        holdProgress = 1.0
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                holdProgress = 0
            }
        }
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.warning)
        action()
    }
}
