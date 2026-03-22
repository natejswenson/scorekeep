import SwiftUI

struct SportSelectorSheet: View {
    @Binding var isPresented: Bool
    let currentSport: Sport
    let hasNonZeroScore: Bool
    let onSelectSport: (Sport) -> Void

    @State private var pendingSport: Sport? = nil

    private let sportGrid: [[Sport]] = [
        [.volleyball, .football],
        [.basketball, .soccer]
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Handle bar
            RoundedRectangle(cornerRadius: 2)
                .fill(Color(hex: "#3A3A3C"))
                .frame(width: 36, height: 4)
                .padding(.top, 12)
                .padding(.bottom, 20)

            Text("Select Sport")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)
                .padding(.bottom, 24)

            // 2×2 sport grid
            VStack(spacing: 14) {
                ForEach(sportGrid, id: \.first) { row in
                    HStack(spacing: 14) {
                        ForEach(row, id: \.self) { sport in
                            SportCard(
                                sport: sport,
                                isActive: sport == currentSport,
                                onTap: { handleTap(sport) }
                            )
                        }
                    }
                }
            }
            .padding(.horizontal, 20)

            Spacer()
        }
        .frame(maxWidth: .infinity)
        .background(Color(hex: "#1C1C1E").ignoresSafeArea())
        // Confirmation when switching with a score in progress
        .confirmationDialog(
            "Switch to \(pendingSport?.displayName ?? "")?",
            isPresented: Binding(
                get: { pendingSport != nil },
                set: { if !$0 { pendingSport = nil } }
            ),
            titleVisibility: .visible
        ) {
            Button("Switch") {
                guard let sport = pendingSport else { return }
                pendingSport = nil
                onSelectSport(sport)
                isPresented = false
            }
            Button("Cancel", role: .cancel) { pendingSport = nil }
        } message: {
            Text("Your current score will be reset.")
        }
    }

    private func handleTap(_ sport: Sport) {
        if sport == currentSport {
            isPresented = false
        } else if hasNonZeroScore {
            pendingSport = sport   // show confirmation dialog
        } else {
            onSelectSport(sport)
            isPresented = false
        }
    }
}

// MARK: - Sport Card

private struct SportCard: View {
    let sport: Sport
    let isActive: Bool
    let onTap: () -> Void

    private var glowColor: Color { Color(hex: sport.glowHex) }

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 10) {
                SportIconView(sport: sport, size: 52, active: isActive)
                Text(sport.displayName)
                    .font(.system(size: 13, weight: .regular))
                    .foregroundColor(isActive ? .white : Color(hex: "#8E8E93"))
            }
            .frame(maxWidth: .infinity)
            .frame(height: 104)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(isActive ? Color(hex: "#2C2C2E") : Color(hex: "#1E1E1E"))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .strokeBorder(
                                isActive ? glowColor.opacity(0.65) : Color(hex: "#2C2C2E"),
                                lineWidth: isActive ? 1.0 : 0.5
                            )
                    )
            )
            .shadow(color: isActive ? glowColor.opacity(0.18) : .clear, radius: 14)
        }
        .buttonStyle(.plain)
    }
}
