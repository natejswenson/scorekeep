import SwiftUI

/// Renders the glowing sport icon for a given sport.
struct SportIconView: View {
    let sport: Sport
    let size: CGFloat
    let active: Bool

    private var glowColor: Color { Color(hex: sport.glowHex) }

    var body: some View {
        Image(systemName: sport.systemImageName)
            .font(.system(size: size * 0.55, weight: .regular))
            .foregroundStyle(active ? glowColor : Color(hex: "#636366"))
            .shadow(color: active ? glowColor.opacity(0.9) : .clear, radius: 8, x: 0, y: 0)
            .shadow(color: active ? glowColor.opacity(0.4) : .clear, radius: 22, x: 0, y: 0)
            .frame(width: size, height: size)
    }
}

/// The small tappable button shown at top-center of the game screen.
struct SportSwitcherButton: View {
    let sport: Sport
    let action: () -> Void

    private var glowColor: Color { Color(hex: sport.glowHex) }

    var body: some View {
        Button(action: action) {
            SportIconView(sport: sport, size: 34, active: true)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(Color.black.opacity(0.65))
                        .overlay(
                            Capsule()
                                .strokeBorder(glowColor.opacity(0.35), lineWidth: 0.75)
                        )
                )
        }
    }
}
