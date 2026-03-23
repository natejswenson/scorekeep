import SwiftUI

struct ThemeSwatch: View {
    let theme: AppTheme
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                HStack(spacing: 0) {
                    LinearGradient(
                        colors: [Color(hex: theme.team1Top), Color(hex: theme.team1Bottom)],
                        startPoint: .top, endPoint: .bottom
                    )
                    LinearGradient(
                        colors: [Color(hex: theme.team2Top), Color(hex: theme.team2Bottom)],
                        startPoint: .top, endPoint: .bottom
                    )
                }
                .clipShape(RoundedRectangle(cornerRadius: 10))

                RoundedRectangle(cornerRadius: 10)
                    .strokeBorder(
                        isSelected ? Color.white : Color.white.opacity(0.15),
                        lineWidth: isSelected ? 2 : 0.5
                    )
            }
            .frame(width: 72, height: 44)
        }
        .buttonStyle(.plain)
    }
}
