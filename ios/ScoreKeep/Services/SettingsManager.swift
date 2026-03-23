import Foundation
import UIKit
import Observation

// MARK: - TimerMode

enum TimerMode: String, Codable, CaseIterable {
    case off, up, down

    var displayName: String {
        switch self {
        case .off:  return "Off"
        case .up:   return "Count Up"
        case .down: return "Count Down"
        }
    }
}

// MARK: - AppTheme

struct AppTheme: Codable, Identifiable, Equatable {
    let id: String
    let name: String
    let team1Top: String
    let team1Bottom: String
    let team2Top: String
    let team2Bottom: String

    static let allThemes: [AppTheme] = [
        AppTheme(id: "classic",       name: "Classic",
                 team1Top: "#3b75e9", team1Bottom: "#0e1e4a",
                 team2Top: "#f32727", team2Bottom: "#460808"),
        AppTheme(id: "midnight",      name: "Midnight",
                 team1Top: "#2c2c2e", team1Bottom: "#000000",
                 team2Top: "#3a3a3c", team2Bottom: "#0a0a0a"),
        AppTheme(id: "tealfire",      name: "Teal & Fire",
                 team1Top: "#0d9488", team1Bottom: "#042f2e",
                 team2Top: "#ea580c", team2Bottom: "#431407"),
        AppTheme(id: "violetgold",    name: "Violet & Gold",
                 team1Top: "#7c3aed", team1Bottom: "#1e0a4a",
                 team2Top: "#d97706", team2Bottom: "#431e00"),
        AppTheme(id: "forestcrimson", name: "Forest & Crimson",
                 team1Top: "#15803d", team1Bottom: "#052e16",
                 team2Top: "#be123c", team2Bottom: "#4c0519"),
    ]

    static let `default` = allThemes[0]
}

// MARK: - SettingsManager

@Observable
final class SettingsManager {
    static let shared = SettingsManager()

    var activeTheme: AppTheme = .default
    var maxScoreVolleyball: Int = 25
    var maxScoreFootball: Int = 0
    var maxScoreBasketball: Int = 0
    var maxScoreSoccer: Int = 0
    var timerMode: TimerMode = .off
    var timerCountDownDuration: Int = 600
    var keepScreenOn: Bool = false
    var hapticsEnabled: Bool = true

    // MARK: Volleyball match rules
    var autoAdvanceSet: Bool = false
    var bestOfSets: Int = 3          // 3, 5, or 7
    var finalSetScore: Int = 15       // score to win the deciding set (win by 2)

    private init() { load() }

    func maxScore(for sport: Sport) -> Int {
        switch sport {
        case .volleyball: return maxScoreVolleyball
        case .football:   return maxScoreFootball
        case .basketball: return maxScoreBasketball
        case .soccer:     return maxScoreSoccer
        }
    }

    func applyScreenSetting() {
        UIApplication.shared.isIdleTimerDisabled = keepScreenOn
    }

    func save() {
        let d = UserDefaults.standard
        if let data = try? JSONEncoder().encode(activeTheme) { d.set(data, forKey: "s.theme") }
        d.set(maxScoreVolleyball,      forKey: "s.maxScore.volleyball")
        d.set(maxScoreFootball,        forKey: "s.maxScore.football")
        d.set(maxScoreBasketball,      forKey: "s.maxScore.basketball")
        d.set(maxScoreSoccer,          forKey: "s.maxScore.soccer")
        d.set(timerMode.rawValue,      forKey: "s.timerMode")
        d.set(timerCountDownDuration,  forKey: "s.timerDuration")
        d.set(keepScreenOn,            forKey: "s.keepScreenOn")
        d.set(hapticsEnabled,          forKey: "s.hapticsEnabled")
        d.set(autoAdvanceSet,          forKey: "s.autoAdvance")
        d.set(bestOfSets,              forKey: "s.bestOf")
        d.set(finalSetScore,           forKey: "s.finalSetScore")
    }

    func load() {
        let d = UserDefaults.standard
        if let data = d.data(forKey: "s.theme"),
           let t = try? JSONDecoder().decode(AppTheme.self, from: data) { activeTheme = t }
        if d.object(forKey: "s.maxScore.volleyball") != nil {
            maxScoreVolleyball = d.integer(forKey: "s.maxScore.volleyball")
        }
        maxScoreFootball   = d.integer(forKey: "s.maxScore.football")
        maxScoreBasketball = d.integer(forKey: "s.maxScore.basketball")
        maxScoreSoccer     = d.integer(forKey: "s.maxScore.soccer")
        if let raw = d.string(forKey: "s.timerMode"), let m = TimerMode(rawValue: raw) { timerMode = m }
        if d.object(forKey: "s.timerDuration") != nil { timerCountDownDuration = d.integer(forKey: "s.timerDuration") }
        keepScreenOn   = d.bool(forKey: "s.keepScreenOn")
        hapticsEnabled = d.object(forKey: "s.hapticsEnabled") != nil ? d.bool(forKey: "s.hapticsEnabled") : true
        autoAdvanceSet = d.bool(forKey: "s.autoAdvance")
        if d.object(forKey: "s.bestOf") != nil { bestOfSets = d.integer(forKey: "s.bestOf") }
        if d.object(forKey: "s.finalSetScore") != nil { finalSetScore = d.integer(forKey: "s.finalSetScore") }
    }
}

// MARK: - Haptic helpers (respect hapticsEnabled toggle)

func hapticImpact(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
    guard SettingsManager.shared.hapticsEnabled else { return }
    UIImpactFeedbackGenerator(style: style).impactOccurred()
}

func hapticNotification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
    guard SettingsManager.shared.hapticsEnabled else { return }
    let g = UINotificationFeedbackGenerator()
    g.prepare()
    g.notificationOccurred(type)
}
