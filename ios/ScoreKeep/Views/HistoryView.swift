import SwiftUI

struct HistoryView: View {
    @Bindable var viewModel: GameViewModel
    @Binding var isPresented: Bool
    @State private var expandedSessionId: UUID? = nil
    @State private var showClearConfirm = false

    private var sport: Sport { viewModel.activeSport }
    private var history: [GameSession] { viewModel.currentHistory }

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#111111").ignoresSafeArea()

                if history.isEmpty {
                    emptyState
                } else {
                    historyList
                }
            }
            .navigationTitle("\(sport.displayName) History")
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
                if !history.isEmpty {
                    ToolbarItem(placement: .destructiveAction) {
                        Button("Clear All") { showClearConfirm = true }
                            .foregroundColor(Color(hex: "#FF453A"))
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                // "New Game" only makes sense for volleyball (archives current session)
                if sport == .volleyball {
                    newGameButton
                }
            }
        }
        .preferredColorScheme(.dark)
        .confirmationDialog(
            "Clear all history?",
            isPresented: $showClearConfirm,
            titleVisibility: .visible
        ) {
            Button("Clear All", role: .destructive) { viewModel.clearAllHistory() }
            Button("Cancel", role: .cancel) {}
        }
    }

    // MARK: - Components

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "clock")
                .font(.system(size: 40))
                .foregroundColor(Color(hex: "#3A3A3C"))
            Text("No games recorded yet.")
                .font(.system(size: 17, weight: .regular))
                .foregroundColor(Color(hex: "#636366"))
        }
    }

    private var historyList: some View {
        List {
            ForEach(history) { session in
                sessionRow(session)
                    .listRowBackground(Color(hex: "#1C1C1E"))
                    .listRowSeparatorTint(Color(hex: "#3A3A3C"))
            }
            .onDelete { indexSet in
                indexSet.forEach { i in
                    viewModel.deleteHistorySession(id: history[i].id)
                }
            }
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
    }

    private func sessionRow(_ session: GameSession) -> some View {
        if session.sport == .volleyball {
            return AnyView(volleyballRow(session))
        } else {
            return AnyView(genericRow(session))
        }
    }

    // Volleyball: show games won, expandable sets
    private func volleyballRow(_ session: GameSession) -> some View {
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

    // Football / Basketball / Soccer: show final score + winner
    private func genericRow(_ session: GameSession) -> some View {
        let winnerLabel: String = {
            if session.team1FinalScore > session.team2FinalScore { return session.team1Name }
            if session.team2FinalScore > session.team1FinalScore { return session.team2Name }
            return "Tie"
        }()

        return HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("\(session.team1Name)  vs  \(session.team2Name)")
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(.white)
                HStack(spacing: 6) {
                    Text(session.startedAt.formatted(date: .abbreviated, time: .shortened))
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "#636366"))
                    Text("·")
                        .foregroundColor(Color(hex: "#636366"))
                    Text(winnerLabel)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(winnerLabel == "Tie" ? Color(hex: "#8E8E93") : Color(hex: sport.glowHex))
                }
            }
            Spacer()
            Text("\(session.team1FinalScore) – \(session.team2FinalScore)")
                .font(.system(size: 20, weight: .thin))
                .foregroundColor(.white)
        }
        .padding(.vertical, 12)
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
