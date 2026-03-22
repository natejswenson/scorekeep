import SwiftUI

struct LandscapeLayout: View {
    @Bindable var viewModel: GameViewModel
    @Binding var showHistory: Bool
    @Binding var showOnboarding: Bool
    @State private var editingTeam: TeamSide? = nil
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil

    var body: some View {
        GeometryReader { geo in
            ZStack {
                HStack(spacing: 0) {
                    TeamHalfView(
                        side: .team1,
                        teamName: viewModel.team1Name,
                        score: viewModel.team1Score,
                        isPortrait: false,
                        onTapName: { editingTeam = .team1 },
                        viewModel: viewModel
                    )
                    .frame(width: geo.size.width / 2)

                    TeamHalfView(
                        side: .team2,
                        teamName: viewModel.team2Name,
                        score: viewModel.team2Score,
                        isPortrait: false,
                        onTapName: { editingTeam = .team2 },
                        viewModel: viewModel
                    )
                    .frame(width: geo.size.width / 2)
                }

                // Hairline vertical separator
                Rectangle()
                    .fill(Color(hex: "#3A3A3C"))
                    .frame(width: 0.5)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .allowsHitTesting(false)

                // Divider controls — vertical stack: history top, reset center, i-button bottom
                VStack(spacing: 20) {
                    Button {
                        showHistory = true
                    } label: {
                        Image(systemName: "clock")
                            .font(.system(size: 15, weight: .light))
                            .foregroundStyle(Color(hex: "#636366"))
                            .frame(width: 44, height: 44)
                            .contentShape(Rectangle())
                    }

                    ResetButton {
                        viewModel.resetSet()
                        triggerUndoToast()
                    }

                    Button {
                        showOnboarding = true
                    } label: {
                        ZStack {
                            Circle()
                                .strokeBorder(Color(hex: "#3A3A3C"), lineWidth: 0.75)
                                .frame(width: 28, height: 28)
                            Text("i")
                                .font(.system(size: 13, weight: .light, design: .serif))
                                .foregroundStyle(Color(hex: "#636366"))
                        }
                    }
                    .frame(width: 44, height: 44)
                    .contentShape(Rectangle())
                }

                // Undo toast
                if showUndoToast {
                    UndoToastView {
                        viewModel.undoReset()
                        dismissToast()
                    }
                    .transition(.asymmetric(
                        insertion: .move(edge: .bottom).combined(with: .opacity),
                        removal: .opacity
                    ))
                    .zIndex(10)
                }
            }
        }
        .sheet(item: $editingTeam) { team in
            TeamNameEditSheet(
                isPresented: Binding(
                    get: { editingTeam != nil },
                    set: { if !$0 { editingTeam = nil } }
                ),
                currentName: team == .team1 ? viewModel.team1Name : viewModel.team2Name,
                onSave: { name in viewModel.updateTeamName(name, team: team) }
            )
        }
    }

    // MARK: - Toast Lifecycle

    private func triggerUndoToast() {
        undoToastTask?.cancel()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            withAnimation(.spring(response: 0.25, dampingFraction: 0.8)) {
                showUndoToast = true
            }
            undoToastTask = Task {
                try? await Task.sleep(for: .seconds(4))
                guard !Task.isCancelled else { return }
                await MainActor.run { dismissToast() }
            }
        }
    }

    private func dismissToast() {
        undoToastTask?.cancel()
        undoToastTask = nil
        withAnimation(.easeOut(duration: 0.2)) {
            showUndoToast = false
        }
    }
}
