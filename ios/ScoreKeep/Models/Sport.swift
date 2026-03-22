import Foundation

enum Sport: String, Codable, CaseIterable, Hashable {
    case volleyball
    case football
    case basketball
    case soccer

    var displayName: String {
        switch self {
        case .volleyball: return "Volleyball"
        case .football:   return "Football"
        case .basketball: return "Basketball"
        case .soccer:     return "Soccer"
        }
    }

    var systemImageName: String {
        switch self {
        case .volleyball: return "volleyball.fill"
        case .football:   return "american.football.fill"
        case .basketball: return "basketball.fill"
        case .soccer:     return "soccerball"
        }
    }

    // Hex strings — converted to Color in views via Color(hex:) extension
    var glowHex: String {
        switch self {
        case .volleyball: return "#38BDF8"  // electric cyan
        case .football:   return "#FB923C"  // orange-coral
        case .basketball: return "#E879F9"  // magenta
        case .soccer:     return "#A78BFA"  // soft violet
        }
    }

    var activeGameKey: String { "activeGame_\(rawValue)" }
    var historyFileName: String { "game_history_\(rawValue).json" }
}
