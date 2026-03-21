import SwiftUI

struct MainGameView: View {
    @State private var viewModel = GameViewModel()
    @State private var showHistory = false

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.verticalSizeClass) private var verticalSizeClass

    private var isLandscape: Bool {
        verticalSizeClass == .compact
    }

    var body: some View {
        ZStack(alignment: .top) {
            Color(hex: "#111111").ignoresSafeArea()

            Group {
                if isLandscape {
                    LandscapeLayout(viewModel: viewModel)
                } else {
                    PortraitLayout(viewModel: viewModel)
                }
            }
            .animation(.easeInOut(duration: 0.3), value: isLandscape)
            .ignoresSafeArea()

            // History icon — top center
            Button {
                showHistory = true
            } label: {
                Image(systemName: "clock")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#636366"))
                    .padding(12)
                    .contentShape(Rectangle())
            }
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.top, 8)
        }
        .preferredColorScheme(.dark)
        .statusBarHidden(true)
        .sheet(isPresented: $showHistory) {
            HistoryView(viewModel: viewModel, isPresented: $showHistory)
        }
    }
}
