import SwiftUI

struct MainGameView: View {
    @State private var viewModel = GameViewModel()
    @State private var showHistory = false

    @Environment(\.verticalSizeClass) private var verticalSizeClass

    private var isLandscape: Bool {
        verticalSizeClass == .compact
    }

    var body: some View {
        // Backgrounds extend edge-to-edge via ignoresSafeArea inside each TeamHalfView.
        // The layout itself respects safe area so content is never hidden under the Dynamic Island.
        Group {
            if isLandscape {
                LandscapeLayout(viewModel: viewModel, showHistory: $showHistory)
            } else {
                PortraitLayout(viewModel: viewModel, showHistory: $showHistory)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: isLandscape)
        .preferredColorScheme(.dark)
        .statusBarHidden(true)
        .sheet(isPresented: $showHistory) {
            HistoryView(viewModel: viewModel, isPresented: $showHistory)
        }
    }
}
