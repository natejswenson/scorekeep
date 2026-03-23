import GoogleMobileAds
import SwiftUI
import UIKit

struct BannerAdView: UIViewRepresentable {
    private let adUnitID = "ca-app-pub-3987898940065025/3761378774"

    func makeUIView(context: Context) -> BannerView {
        let banner = BannerView()
        banner.adUnitID = adUnitID
        banner.adSize = currentOrientationInlineAdaptiveBanner(width: UIScreen.main.bounds.width)
        banner.rootViewController = rootViewController
        banner.backgroundColor = .clear
        banner.load(Request())
        return banner
    }

    func updateUIView(_ uiView: BannerView, context: Context) {}

    private var rootViewController: UIViewController? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first?.keyWindow?.rootViewController
    }
}
