import SwiftUI

struct SetCompleteButton: View {
    let action: () -> Void

    @State private var holdProgress: CGFloat = 0
    @State private var isHolding: Bool = false
    @GestureState private var isPressed: Bool = false

    private let holdDuration: TimeInterval = 1.2

    var body: some View {
        ZStack {
            // Progress ring — same size/style as ResetButton
            Circle()
                .trim(from: 0, to: holdProgress)
                .stroke(
                    Color.white.opacity(0.70),
                    style: StrokeStyle(lineWidth: 2, lineCap: .round)
                )
                .frame(width: 76, height: 76)
                .rotationEffect(.degrees(-90))

            // Button body
            ZStack {
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
                .scaleEffect(isHolding ? 0.88 : 1.0)
                .animation(.easeInOut(duration: 0.15), value: isHolding)
            }
        }
        .gesture(
            LongPressGesture(minimumDuration: holdDuration)
                .updating($isPressed) { value, state, _ in state = value }
                .onEnded { _ in fireAction() }
        )
        .onChange(of: isPressed) { _, pressing in
            if pressing { startHold() } else { cancelHold() }
        }
    }

    // MARK: - Hold Lifecycle

    private func startHold() {
        isHolding = true
        hapticImpact(.light)
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

    private func fireAction() {
        isHolding = false
        holdProgress = 1.0
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                holdProgress = 0
            }
        }
        hapticNotification(.success)
        action()
    }
}
