import SwiftUI
import GoogleMobileAds

@main
struct ScoreKeepApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            MainGameView()
                .environmentObject(StoreKitManager.shared)
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        AdsManager.shared.initialize()
        SettingsManager.shared.applyScreenSetting()
        return true
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        Task { @MainActor in
            AdsManager.shared.showAppOpenAdIfAvailable()
        }
        TimerManager.shared.handleForeground()
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        TimerManager.shared.handleBackground()
    }
}
