import SwiftUI

/// A single scoring chip — styled like the sport selector cards.
/// Shows the point value in Digital-7 with "pts" / "pt" label beneath.
struct ScoringChip: View {
    let points: Int
    let accentColor: Color
    let action: () -> Void

    @GestureState private var isPressed = false

    private var suffix: String { points == 1 ? "pt" : "pts" }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 1) {
                Text("\(points)")
                    .font(.custom("Digital-7", size: 28))
                    .foregroundColor(accentColor)
                Text(suffix)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(accentColor.opacity(0.65))
                    .kerning(0.8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color(hex: "#1C1C1E"))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .strokeBorder(accentColor.opacity(0.45), lineWidth: 0.75)
                    )
            )
            .shadow(color: accentColor.opacity(0.18), radius: 10, x: 0, y: 0)
        }
        .buttonStyle(.plain)
    }
}

/// Undo chip — same card style, muted when disabled.
struct UndoChip: View {
    let canUndo: Bool
    let action: () -> Void

    var body: some View {
        Button {
            guard canUndo else { return }
            action()
        } label: {
            Image(systemName: "arrow.uturn.backward")
                .font(.system(size: 15, weight: .light))
                .foregroundColor(canUndo ? Color(hex: "#8E8E93") : Color(hex: "#3A3A3C"))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color(hex: "#1C1C1E"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .strokeBorder(
                                    canUndo
                                        ? Color(hex: "#8E8E93").opacity(0.35)
                                        : Color(hex: "#2C2C2E"),
                                    lineWidth: 0.75
                                )
                        )
                )
        }
        .buttonStyle(.plain)
        .disabled(!canUndo)
    }
}
