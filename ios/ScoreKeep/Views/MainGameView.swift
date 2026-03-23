import SwiftUI

struct MainGameView: View {
    @State private var viewModel = GameViewModel()
    @State private var showDrawer = false
    @State private var showHistory = false
    @State private var showOnboarding = !UserDefaults.standard.bool(forKey: "hasSeenOnboarding")
    @State private var showUndoToast = false
    @State private var undoToastTask: Task<Void, Never>? = nil
    @State private var showBannerAd = false
    @State private var adCycleTask: Task<Void, Never>? = nil

    @Environment(\.verticalSizeClass) private var verticalSizeClass

    private var isLandscape: Bool { verticalSizeClass == .compact }

    var body: some View {
        ZStack(alignment: .top) {
            // Main layout
            Group {
                if isLandscape {
                    LandscapeLayout(viewModel: viewModel, showBannerAd: showBannerAd)
                } else {
                    VStack(spacing: 0) {
                        PortraitLayout(viewModel: viewModel)
                        if showBannerAd {
                            BannerAdView()
                                .frame(height: 50)
                                .frame(maxWidth: .infinity)
                                .background(Color(hex: "#460808"))
                                .transition(.move(edge: .bottom).combined(with: .opacity))
                        }
                    }
                }
            }
            .animation(.easeInOut(duration: 0.3), value: isLandscape)
            // Drawer swipe — simultaneous so it never blocks taps on team names
            .simultaneousGesture(
                DragGesture(minimumDistance: 20)
                    .onEnded { v in
                        guard !showDrawer else { return }
                        if v.translation.height > 20 {
                            withAnimation(.easeInOut(duration: 0.22)) { showDrawer = true }
                        }
                    }
            )

            // Undo toast (new game)
            if showUndoToast {
                UndoToastView(message: "Undo Reset") {
                    viewModel.undoReset()
                    dismissToast()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                .transition(.asymmetric(
                    insertion: .move(edge: .bottom).combined(with: .opacity),
                    removal: .opacity
                ))
                .zIndex(10)
            }

            // Drawer backdrop
            if showDrawer {
                Color.black.opacity(0.55)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.22)) { showDrawer = false }
                    }
                    .transition(.opacity)
                    .zIndex(90)
            }

            // Drawer panel
            if showDrawer {
                SwipeDrawerView(
                    isPresented: $showDrawer,
                    viewModel: viewModel,
                    onNewGame: { handleNewGame() },
                    onHistory: { showHistory = true },
                    onInfo: { showOnboarding = true }
                )
                .frame(maxWidth: .infinity, alignment: .top)
                .transition(.move(edge: .top).combined(with: .opacity))
                .zIndex(91)
            }

        }
        .onAppear {
            startAdCycle()
        }
        .preferredColorScheme(.dark)
        .statusBarHidden(true)
        .sheet(isPresented: $showHistory) {
            HistoryView(viewModel: viewModel, isPresented: $showHistory)
        }
        .fullScreenCover(isPresented: $showOnboarding) {
            OnboardingView(isPresented: $showOnboarding)
        }
    }

    // MARK: - Ad Cycle

    private func startAdCycle() {
        adCycleTask?.cancel()
        adCycleTask = Task {
            // Initial delay before first banner appearance
            try? await Task.sleep(for: .seconds(60))
            while !Task.isCancelled {
                await MainActor.run {
                    withAnimation(.easeInOut(duration: 0.4)) { showBannerAd = true }
                }
                try? await Task.sleep(for: .seconds(30))
                if Task.isCancelled { break }
                await MainActor.run {
                    withAnimation(.easeInOut(duration: 0.4)) { showBannerAd = false }
                }
                try? await Task.sleep(for: .seconds(180))
            }
        }
    }

    // MARK: - New Game

    private func handleNewGame() {
        withAnimation(.easeInOut(duration: 0.22)) { showDrawer = false }
        viewModel.handleReset()
        TimerManager.shared.handleNewGame()
        triggerUndoToast()
    }

    // MARK: - Toast Lifecycle

    private func triggerUndoToast() {
        undoToastTask?.cancel()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
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
        withAnimation(.easeOut(duration: 0.2)) { showUndoToast = false }
    }
}
