import SwiftUI

struct SwipeDrawerView: View {
    @Binding var isPresented: Bool
    @Bindable var viewModel: GameViewModel
    let onNewGame: () -> Void
    let onHistory: () -> Void
    let onInfo: () -> Void

    @State private var showSportSelector = false
    @State private var showSettings = false
    private var timer: TimerManager { TimerManager.shared }
    private var settings: SettingsManager { SettingsManager.shared }

    var body: some View {
        VStack(spacing: 0) {
            // Drag handle
            Capsule()
                .fill(Color.white.opacity(0.18))
                .frame(width: 36, height: 4)
                .padding(.top, 14)
                .padding(.bottom, 10)

            // Timer row (shown when timer mode is active)
            if settings.timerMode != .off {
                timerRow
                rowDivider
            }

            drawerRow(
                icon: viewModel.activeSport.systemImageName,
                label: "Sport",
                value: viewModel.activeSport.displayName
            ) {
                showSportSelector = true
            }

            rowDivider

            drawerRow(icon: "arrow.counterclockwise", label: "New Game") {
                onNewGame()
            }

            rowDivider

            drawerRow(icon: "clock", label: "History") {
                withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { onHistory() }
            }

            rowDivider

            drawerRow(icon: "info.circle", label: "Help") {
                withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { onInfo() }
            }

            rowDivider

            drawerRow(icon: "gearshape", label: "Settings") {
                showSettings = true
            }

            Color.clear.frame(height: 24)
        }
        .background(Color(hex: "#111111"))
        .gesture(
            DragGesture(minimumDistance: 20)
                .onEnded { v in
                    if v.translation.height < -30 {
                        withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                    }
                }
        )
        .sheet(isPresented: $showSettings) {
            SettingsSheet(isPresented: $showSettings)
        }
        .sheet(isPresented: $showSportSelector) {
            SportSelectorSheet(
                isPresented: $showSportSelector,
                currentSport: viewModel.activeSport,
                hasNonZeroScore: viewModel.hasNonZeroScore,
                onSelectSport: { sport in
                    viewModel.switchSport(sport)
                    withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                }
            )
            .presentationDetents([.height(340)])
            .presentationDragIndicator(.hidden)
        }
    }

    private var timerRow: some View {
        Button {
            if timer.isRunning { timer.pause() } else { timer.start() }
        } label: {
            HStack(spacing: 16) {
                Image(systemName: timer.isRunning ? "pause.circle" : "play.circle")
                    .font(.system(size: 17, weight: .light))
                    .foregroundStyle(Color.white.opacity(0.60))
                    .frame(width: 26)

                Text(timer.formattedTime())
                    .font(.custom("Digital-7", size: 22))
                    .foregroundStyle(timer.isExpired ? Color(hex: "#FFD700") : Color.white.opacity(0.90))
                    .monospacedDigit()

                Spacer()

                Text(settings.timerMode == .down ? "remaining" : "elapsed")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundStyle(Color.white.opacity(0.30))
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            LongPressGesture(minimumDuration: 0.6).onEnded { _ in
                timer.reset()
                hapticImpact(.medium)
            }
        )
    }

    private var rowDivider: some View {
        Rectangle()
            .fill(Color.white.opacity(0.08))
            .frame(height: 0.5)
            .padding(.horizontal, 20)
    }

    private func drawerRow(
        icon: String,
        label: String,
        value: String? = nil,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 17, weight: .light))
                    .foregroundStyle(Color.white.opacity(0.60))
                    .frame(width: 26)

                Text(label)
                    .font(.system(size: 17, weight: .regular))
                    .foregroundStyle(Color.white.opacity(0.90))

                Spacer()

                if let value {
                    Text(value)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundStyle(Color.white.opacity(0.35))
                }

                Image(systemName: "chevron.right")
                    .font(.system(size: 11, weight: .light))
                    .foregroundStyle(Color.white.opacity(0.20))
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 18)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
