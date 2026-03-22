import SwiftUI

/// A point-value selector chip. Highlighted when selected; muted otherwise.
/// Tapping selects the chip — scoring happens via tap-anywhere on the parent view.
struct ScoringChip: View {
    let points: Int
    let accentColor: Color
    let isSelected: Bool
    let action: () -> Void

    private var suffix: String { points == 1 ? "pt" : "pts" }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 1) {
                Text("\(points)")
                    .font(.custom("Digital-7", size: 22))
                    .foregroundColor(isSelected ? accentColor : Color(hex: "#3A3A3C"))
                Text(suffix)
                    .font(.system(size: 8, weight: .medium))
                    .foregroundColor(isSelected ? accentColor.opacity(0.65) : Color(hex: "#2C2C2E"))
                    .kerning(0.8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: "#1C1C1E"))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(
                                isSelected ? accentColor.opacity(0.55) : Color(hex: "#2C2C2E"),
                                lineWidth: 0.75
                            )
                    )
            )
            .shadow(
                color: isSelected ? accentColor.opacity(0.20) : .clear,
                radius: 8, x: 0, y: 0
            )
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
                .font(.system(size: 14, weight: .light))
                .foregroundColor(canUndo ? Color(hex: "#8E8E93") : Color(hex: "#3A3A3C"))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color(hex: "#1C1C1E"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
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
