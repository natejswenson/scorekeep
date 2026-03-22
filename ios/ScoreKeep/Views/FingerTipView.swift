import SwiftUI

struct FingerTipView: View {
    var isHolding: Bool = false

    var body: some View {
        Circle()
            .fill(Color.white.opacity(isHolding ? 0.15 : 0.22))
            .frame(width: isHolding ? 36 : 28, height: isHolding ? 36 : 28)
            .overlay(
                Circle()
                    .strokeBorder(Color.white.opacity(0.4), lineWidth: 1)
            )
            .animation(.easeInOut(duration: 0.3), value: isHolding)
    }
}
