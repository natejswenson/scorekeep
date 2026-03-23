import SwiftUI

// MARK: - Slide 1: Tap to Score — count 1→25

struct TapToScoreAnimation: View {
    @State private var score = 0
    @State private var rippleScale: CGFloat = 0.3
    @State private var rippleOpacity = 0.0
    @State private var running = false

    private let tapInterval: TimeInterval = 0.55

    var body: some View {
        ZStack {
            Color(hex: "#111111")

            // Bluish-purple tap ripple
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color(hex: "#C4B5FD").opacity(0.35), Color(hex: "#818CF8").opacity(0)],
                        center: .center,
                        startRadius: 0,
                        endRadius: 60
                    )
                )
                .frame(width: 120, height: 120)
                .scaleEffect(rippleScale)
                .opacity(rippleOpacity)
                .allowsHitTesting(false)

            Text(score == 0 ? "" : "\(score)")
                .font(.custom("Digital-7", size: 150))
                .foregroundColor(.white)
                .minimumScaleFactor(0.3)
                .animation(nil, value: score)
        }
        .onAppear {
            guard !running else { return }
            running = true
            runLoop()
        }
    }

    private func runLoop() {
        score = 0
        let total = 25
        for i in 1...total {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * tapInterval) {
                score = i
                // Snap ripple to small, then expand + fade
                rippleScale = 0.3
                rippleOpacity = 0.9
                withAnimation(.easeOut(duration: 0.45)) {
                    rippleScale = 1.4
                    rippleOpacity = 0
                }
            }
        }
        // Pause at 25, then loop
        DispatchQueue.main.asyncAfter(deadline: .now() + Double(total) * tapInterval + 1.8) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { runLoop() }
        }
    }
}

// MARK: - Slide 2: Long Press to Subtract — hold ring + count 13→1

struct LongPressAnimation: View {
    @State private var score = 13
    @State private var ringProgress: CGFloat = 0
    @State private var flashOpacity = 0.0
    @State private var running = false

    var body: some View {
        ZStack {
            Color(hex: "#111111")

            VStack(spacing: 20) {
                Text("\(score)")
                    .font(.custom("Digital-7", size: 150))
                    .foregroundColor(.white)
                    .minimumScaleFactor(0.3)
                    .animation(nil, value: score)

                // Small progress ring as hold indicator
                Circle()
                    .trim(from: 0, to: ringProgress)
                    .stroke(
                        LinearGradient(
                            colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                            startPoint: .top, endPoint: .bottom
                        ),
                        style: StrokeStyle(lineWidth: 2, lineCap: .round)
                    )
                    .frame(width: 28, height: 28)
                    .rotationEffect(.degrees(-90))
            }

            Color(red: 1, green: 0.231, blue: 0, opacity: flashOpacity)
                .allowsHitTesting(false)
        }
        .onAppear {
            guard !running else { return }
            running = true
            runLoop()
        }
    }

    private func runLoop() {
        score = 13
        runDecrement()
    }

    private func runDecrement() {
        guard score > 1 else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { runLoop() }
            return
        }
        // Fill ring
        withAnimation(.linear(duration: 0.55)) { ringProgress = 1.0 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.55) {
            score -= 1
            withAnimation(.spring(response: 0.18)) { ringProgress = 0 }
            withAnimation(.easeIn(duration: 0.04)) { flashOpacity = 0.06 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) {
                withAnimation(.easeOut(duration: 0.06)) { flashOpacity = 0 }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { runDecrement() }
        }
    }
}

// MARK: - Slide 3: Reset the Set

struct ResetAnimation: View {
    @State private var score1 = 14
    @State private var score2 = 11
    @State private var ringProgress: CGFloat = 0
    @State private var showUndo = false
    @State private var undoOpacity = 0.0
    @State private var running = false

    var body: some View {
        ZStack {
            Color(hex: "#111111")

            VStack(spacing: 0) {
                // Scores side by side
                HStack(spacing: 0) {
                    Text("\(score1)")
                        .font(.custom("Digital-7", size: 96))
                        .foregroundColor(.white)
                        .minimumScaleFactor(0.3)
                        .frame(maxWidth: .infinity)

                    // Progress ring in the middle
                    ZStack {
                        Circle()
                            .trim(from: 0, to: ringProgress)
                            .stroke(
                                LinearGradient(
                                    colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                                    startPoint: .top, endPoint: .bottom
                                ),
                                style: StrokeStyle(lineWidth: 2, lineCap: .round)
                            )
                            .frame(width: 44, height: 44)
                            .rotationEffect(.degrees(-90))

                        Image(systemName: "arrow.counterclockwise")
                            .font(.system(size: 16, weight: .light))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                                    startPoint: .top, endPoint: .bottom
                                )
                            )
                    }
                    .frame(width: 60)

                    Text("\(score2)")
                        .font(.custom("Digital-7", size: 96))
                        .foregroundColor(.white)
                        .minimumScaleFactor(0.3)
                        .frame(maxWidth: .infinity)
                }

                // Undo toast
                if showUndo {
                    UndoToastView(message: "Undo Reset") { }
                        .opacity(undoOpacity)
                        .padding(.top, 20)
                        .transition(.opacity)
                }
            }
            .padding(.horizontal, 24)
        }
        .onAppear {
            guard !running else { return }
            running = true
            runLoop()
        }
    }

    private func runLoop() {
        score1 = 14; score2 = 11
        showUndo = false; undoOpacity = 0

        // Fill ring
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            withAnimation(.linear(duration: 1.2)) { ringProgress = 1.0 }
        }

        // Reset scores
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.7) {
            withAnimation { score1 = 0; score2 = 0 }
            withAnimation(.spring(response: 0.2)) { ringProgress = 0 }
        }

        // Show undo
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.1) {
            showUndo = true
            withAnimation(.spring(response: 0.25)) { undoOpacity = 1 }
        }

        // Undo restores scores
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.2) {
            withAnimation { score1 = 14; score2 = 11 }
            withAnimation(.easeOut(duration: 0.2)) { undoOpacity = 0 }
        }

        // Loop
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.8) {
            showUndo = false
            ringProgress = 0
            runLoop()
        }
    }
}

// MARK: - Slide 4: History & New Game

struct HistoryAndNamesAnimation: View {
    @State private var scene = 0 // 0 = history, 1 = new game
    @State private var clockGlow = false
    @State private var showNewGame = false

    var body: some View {
        ZStack {
            Color(hex: "#111111")

            if scene == 0 {
                historyScene
                    .transition(.opacity)
            } else {
                newGameScene
                    .transition(.opacity)
            }
        }
        .onAppear { runScene0() }
    }

    private var historyScene: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Clock icon — centered
            HStack {
                Spacer()
                ZStack {
                    if clockGlow {
                        Circle()
                            .strokeBorder(Color(hex: "#636366").opacity(0.4), lineWidth: 8)
                            .frame(width: 36, height: 36)
                            .blur(radius: 4)
                    }
                    Image(systemName: "clock")
                        .font(.system(size: 18, weight: .light))
                        .foregroundStyle(clockGlow ? Color.white : Color(hex: "#636366"))
                }
                Spacer()
            }
            .padding(.top, 16)

            Rectangle()
                .fill(Color(hex: "#3A3A3C"))
                .frame(height: 0.5)
                .padding(.vertical, 16)

            // Sample history row
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Suckers  vs  Nuggets")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.white)
                    Text("Mar 21, 2026")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#636366"))
                }
                Spacer()
                Text("3 – 2")
                    .font(.system(size: 20, weight: .thin))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 20)

            Spacer()
        }
    }

    private var newGameScene: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "plus.circle")
                .font(.system(size: 36, weight: .ultraLight))
                .foregroundStyle(Color(hex: "#636366"))

            Text("New Game")
                .font(.system(size: 18, weight: .light))
                .foregroundColor(Color(hex: "#8E8E93"))

            Spacer()
        }
    }

    private func runScene0() {
        scene = 0
        clockGlow = false

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            withAnimation(.easeInOut(duration: 0.4)) { clockGlow = true }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            withAnimation(.easeOut(duration: 0.3)) { clockGlow = false }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.4) {
            withAnimation(.easeInOut(duration: 0.4)) { scene = 1 }
            runScene1()
        }
    }

    private func runScene1() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) {
            withAnimation(.easeInOut(duration: 0.4)) { scene = 0 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { runScene0() }
        }
    }
}
