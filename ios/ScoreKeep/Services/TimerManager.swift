import Foundation
import Observation

@Observable
final class TimerManager {
    static let shared = TimerManager()

    var elapsedSeconds: Int = 0
    var isRunning: Bool = false

    private var timer: Timer?

    private init() {
        let d = UserDefaults.standard
        elapsedSeconds = d.integer(forKey: "timer.elapsed")
        isRunning = d.bool(forKey: "timer.running")
        if isRunning {
            if let bg = d.object(forKey: "timer.bgDate") as? Date {
                elapsedSeconds += Int(Date().timeIntervalSince(bg))
                d.removeObject(forKey: "timer.bgDate")
            }
            startTick()
        }
    }

    // Called when a new game/set starts
    func handleNewGame() {
        let mode = SettingsManager.shared.timerMode
        guard mode != .off else { return }
        reset()
        start()
    }

    func start() {
        guard !isRunning else { return }
        isRunning = true
        startTick()
        persist()
    }

    func pause() {
        guard isRunning else { return }
        isRunning = false
        timer?.invalidate()
        timer = nil
        persist()
    }

    func reset() {
        timer?.invalidate()
        timer = nil
        elapsedSeconds = 0
        isRunning = false
        persist()
    }

    func formattedTime() -> String {
        let seconds: Int
        let mode = SettingsManager.shared.timerMode
        if mode == .down {
            seconds = max(0, SettingsManager.shared.timerCountDownDuration - elapsedSeconds)
        } else {
            seconds = elapsedSeconds
        }
        return String(format: "%d:%02d", seconds / 60, seconds % 60)
    }

    var isExpired: Bool {
        SettingsManager.shared.timerMode == .down &&
        elapsedSeconds >= SettingsManager.shared.timerCountDownDuration
    }

    // MARK: - App lifecycle

    func handleBackground() {
        guard isRunning else { return }
        UserDefaults.standard.set(Date(), forKey: "timer.bgDate")
        persist()
    }

    func handleForeground() {
        guard isRunning else { return }
        if let bg = UserDefaults.standard.object(forKey: "timer.bgDate") as? Date {
            elapsedSeconds += Int(Date().timeIntervalSince(bg))
            UserDefaults.standard.removeObject(forKey: "timer.bgDate")
        }
    }

    // MARK: - Private

    private func startTick() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.elapsedSeconds += 1
        }
    }

    private func persist() {
        let d = UserDefaults.standard
        d.set(elapsedSeconds, forKey: "timer.elapsed")
        d.set(isRunning,      forKey: "timer.running")
    }
}
