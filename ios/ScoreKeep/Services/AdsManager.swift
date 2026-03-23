import GoogleMobileAds
import UIKit

@MainActor
class AdsManager: NSObject, ObservableObject {
    static let shared = AdsManager()

    private let appOpenAdUnitID = "ca-app-pub-3987898940065025/4882888757"

    private var appOpenAd: AppOpenAd?
    private var isLoadingAd = false
    private var isShowingAd = false

    private override init() {
        super.init()
    }

    func initialize() {
        MobileAds.shared.start(completionHandler: nil)
        loadAppOpenAd()
    }

    func loadAppOpenAd() {
        guard !isLoadingAd, appOpenAd == nil else { return }
        isLoadingAd = true

        Task {
            do {
                appOpenAd = try await AppOpenAd.load(
                    with: appOpenAdUnitID,
                    request: Request()
                )
                appOpenAd?.fullScreenContentDelegate = self
            } catch {
                print("App open ad failed to load: \(error)")
            }
            isLoadingAd = false
        }
    }

    func showAppOpenAdIfAvailable() {
        guard !isShowingAd, let ad = appOpenAd else {
            loadAppOpenAd()
            return
        }
        guard let rootVC = rootViewController else { return }
        isShowingAd = true
        ad.present(from: rootVC)
    }

    private var rootViewController: UIViewController? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first?.keyWindow?.rootViewController
    }
}

extension AdsManager: FullScreenContentDelegate {
    nonisolated func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        Task { @MainActor in
            self.appOpenAd = nil
            self.isShowingAd = false
            self.loadAppOpenAd()
        }
    }

    nonisolated func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        Task { @MainActor in
            self.appOpenAd = nil
            self.isShowingAd = false
            self.loadAppOpenAd()
        }
    }
}
