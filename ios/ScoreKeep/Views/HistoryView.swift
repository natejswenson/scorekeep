import SwiftUI

struct HistoryView: View {
    @Bindable var viewModel: GameViewModel
    @Binding var isPresented: Bool
    @State private var expandedSessionId: UUID? = nil
    @State private var showClearConfirm = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#111111").ignoresSafeArea()

                if viewModel.gameHistory.isEmpty {
                    emptyState
                } else {
                    historyList
                }
            }
            .navigationTitle("History")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Color(hex: "#111111"), for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        isPresented = false
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#636366"))
                    }
                }
                if !viewModel.gameHistory.isEmpty {
                    ToolbarItem(placement: .destructiveAction) {
                        Button("Clear All") {
                            showClearConfirm = true
                        }
                        .foregroundColor(Color(hex: "#FF453A"))
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                newGameButton
            }
        }
        .preferredColorScheme(.dark)
        .confirmationDialog(
            "Clear all history?",
            isPresented: $showClearConfirm,
            titleVisibility: .visible
        ) {
            Button("Clear All", role: .destructive) {
                viewModel.clearAllHistory()
            }
            Button("Cancel", role: .cancel) {}
        }
    }

    // MARK: - Components

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "clock")
                .font(.system(size: 40))
                .foregroundColor(Color(hex: "#3A3A3C"))
            Text("No games yet.")
                .font(.system(size: 17, weight: .regular))
                .foregroundColor(Color(hex: "#636366"))
        }
    }

    private var historyList: some View {
        List {
            ForEach(viewModel.gameHistory) { session in
                sessionRow(session)
                    .listRowBackground(Color(hex: "#1C1C1E"))
                    .listRowSeparatorTint(Color(hex: "#3A3A3C"))
            }
            .onDelete { indexSet in
                indexSet.forEach { i in
                    viewModel.deleteHistorySession(id: viewModel.gameHistory[i].id)
                }
            }
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
    }

    private func sessionRow(_ session: GameSession) -> some View {
        let isExpanded = expandedSessionId == session.id
        return VStack(alignment: .leading, spacing: 0) {
            Button {
                withAnimation(.easeInOut(duration: 0.2)) {
                    expandedSessionId = isExpanded ? nil : session.id
                }
            } label: {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(session.team1Name)  vs  \(session.team2Name)")
                            .font(.system(size: 15, weight: .regular))
                            .foregroundColor(.white)
                        Text(session.startedAt.formatted(date: .abbreviated, time: .shortened))
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "#636366"))
                    }
                    Spacer()
                    Text("\(session.team1GamesWon) – \(session.team2GamesWon)")
                        .font(.system(size: 20, weight: .thin))
                        .foregroundColor(.white)
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hex: "#636366"))
                        .padding(.leading, 8)
                }
                .padding(.vertical, 12)
            }
            .buttonStyle(.plain)

            if isExpanded {
                VStack(spacing: 0) {
                    Divider().background(Color(hex: "#3A3A3C"))
                    ForEach(Array(session.sets.enumerated()), id: \.offset) { idx, set in
                        HStack {
                            Text("Set \(idx + 1)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "#636366"))
                            Spacer()
                            Text("\(set.team1Score) – \(set.team2Score)")
                                .font(.system(size: 14, weight: .regular))
                                .foregroundColor(Color(hex: "#AEAEB2"))
                        }
                        .padding(.vertical, 8)
                        if idx < session.sets.count - 1 {
                            Divider().background(Color(hex: "#2C2C2E"))
                        }
                    }
                }
                .padding(.bottom, 8)
            }
        }
    }

    private var newGameButton: some View {
        Button {
            viewModel.startNewGame()
            isPresented = false
        } label: {
            Text("New Game")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.black)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 12)
        .background(Color(hex: "#111111"))
    }
}
