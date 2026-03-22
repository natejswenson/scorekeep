import SwiftUI

// MARK: - Slide 1: Tap to Score

struct TapToScoreAnimation: View {
    @State private var score = 7
    @State private var showFinger = false
    @State private var fingerOpacity = 0.0
    @State private var scoreScale: CGFloat = 1.0
    @State private var flashOpacity = 0.0

    var body: some View {
        ZStack {
            // Team half replica
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: "#1E1E1E"))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .strokeBorder(Color(hex: "#2C2C2E"), lineWidth: 1)
                )

            // Flash overlay
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(flashOpacity))
                .allowsHitTesting(false)

            // Score
            Text("\(score)")
                .font(.custom("Digital-7", size: 110))
                .foregroundColor(.white)
                .scaleEffect(scoreScale)
                .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)

            // Fingertip
            if showFinger {
                FingerTipView(isHolding: false)
                    .opacity(fingerOpacity)
                    .offset(y: 20)
            }
        }
        .onAppear { runLoop() }
    }

    private func runLoop() {
        // Show finger
        showFinger = true
        withAnimation(.easeIn(duration: 0.2)) { fingerOpacity = 1 }

        // Tap at 0.6s
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            score += 1
            scoreScale = 0.85
            withAnimation(.easeIn(duration: 0.06)) { flashOpacity = 0.06 }
            withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
                withAnimation(.easeOut(duration: 0.06)) { flashOpacity = 0 }
            }
        }

        // Fade finger out at 1.0s, reset at 2.5s
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            withAnimation(.easeOut(duration: 0.3)) { fingerOpacity = 0 }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            score = 7
            scoreScale = 1.0
            runLoop()
        }
    }
}

// MARK: - Slide 2: Long Press to Subtract

struct LongPressAnimation: View {
    @State private var score = 8
    @State private var isHolding = false
    @State private var fingerOpacity = 0.0
    @State private var holdLabelOpacity = 0.0
    @State private var scoreScale: CGFloat = 1.0
    @State private var flashOpacity = 0.0

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: "#1E1E1E"))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .strokeBorder(Color(hex: "#2C2C2E"), lineWidth: 1)
                )

            // Red flash for decrement
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(red: 1, green: 0.231, blue: 0, opacity: flashOpacity))
                .allowsHitTesting(false)

            Text("\(score)")
                .font(.custom("Digital-7", size: 110))
                .foregroundColor(.white)
                .scaleEffect(scoreScale)
                .animation(.spring(response: 0.18, dampingFraction: 0.7), value: scoreScale)

            VStack(spacing: 8) {
                Spacer()
                FingerTipView(isHolding: isHolding)
                    .opacity(fingerOpacity)

                Text("Hold...")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(hex: "#636366"))
                    .opacity(holdLabelOpacity)
                    .padding(.bottom, 20)
            }
        }
        .onAppear { runLoop() }
    }

    private func runLoop() {
        // Show finger
        withAnimation(.easeIn(duration: 0.3)) { fingerOpacity = 1 }

        // Start holding at 0.5s
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            isHolding = true
            withAnimation(.easeIn(duration: 0.2)) { holdLabelOpacity = 1 }
        }

        // Decrement at 1.0s (0.45s long press)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            score = max(0, score - 1)
            isHolding = false
            scoreScale = 1.1
            withAnimation(.easeIn(duration: 0.06)) { flashOpacity = 0.06 }
            withAnimation(.spring(response: 0.18, dampingFraction: 0.7)) { scoreScale = 1.0 }
            withAnimation(.easeOut(duration: 0.2)) { holdLabelOpacity = 0 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
                withAnimation(.easeOut(duration: 0.06)) { flashOpacity = 0 }
            }
        }

        // Fade out and reset
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            withAnimation(.easeOut(duration: 0.3)) { fingerOpacity = 0 }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
            score = 8
            scoreScale = 1.0
            runLoop()
        }
    }
}

// MARK: - Slide 3: Reset the Set

struct ResetAnimation: View {
    @State private var phase: Int = 0 // 0=holding, 1=reset fired, 2=undo showing
    @State private var ringProgress: CGFloat = 0
    @State private var fingerOpacity = 0.0
    @State private var fingerOnButton = true
    @State private var fingerOnToast = false
    @State private var score1 = 14
    @State private var score2 = 11
    @State private var showUndo = false
    @State private var undoOpacity = 0.0

    var body: some View {
        ZStack {
            // Mini scoreboard replica
            VStack(spacing: 0) {
                // Top half
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(hex: "#1E1E1E"))
                    Text("\(score1)")
                        .font(.custom("Digital-7", size: 72))
                        .foregroundColor(.white)
                }
                .frame(height: 130)

                // Divider with reset button
                ZStack {
                    Color.clear.frame(height: 60)

                    Rectangle()
                        .fill(Color(hex: "#3A3A3C"))
                        .frame(height: 0.5)
                        .allowsHitTesting(false)

                    // Progress ring + reset button
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
                            .frame(width: 52, height: 52)
                            .rotationEffect(.degrees(-90))

                        Circle()
                            .fill(Color.black.opacity(0.55))
                            .frame(width: 44, height: 44)

                        Image(systemName: "arrow.counterclockwise")
                            .font(.system(size: 16, weight: .light))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color(hex: "#C4B5FD"), Color(hex: "#818CF8")],
                                    startPoint: .top, endPoint: .bottom
                                )
                            )
                            .shadow(color: Color(hex: "#818CF8").opacity(0.9), radius: 5)
                    }

                    // Undo toast overlaid on divider
                    if showUndo {
                        UndoToastView { }
                            .opacity(undoOpacity)
                    }

                    // Fingertip — moves between button and toast
                    FingerTipView(isHolding: fingerOnButton && phase == 0)
                        .opacity(fingerOpacity)
                        .offset(x: fingerOnToast ? 20 : 0, y: fingerOnToast ? 0 : 0)
                }

                // Bottom half
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(hex: "#161616"))
                    Text("\(score2)")
                        .font(.custom("Digital-7", size: 72))
                        .foregroundColor(.white)
                }
                .frame(height: 130)
            }
            .padding(.horizontal, 24)
        }
        .onAppear { runLoop() }
    }

    private func runLoop() {
        phase = 0
        score1 = 14; score2 = 11
        showUndo = false; undoOpacity = 0
        fingerOnButton = true; fingerOnToast = false

        // Show finger on button
        withAnimation(.easeIn(duration: 0.3)) { fingerOpacity = 1 }

        // Fill progress ring over 1.2s
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            withAnimation(.linear(duration: 1.2)) { ringProgress = 1.0 }
        }

        // Fire reset at 1.6s
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            phase = 1
            withAnimation { score1 = 0; score2 = 0 }
            withAnimation(.spring(response: 0.2)) { ringProgress = 0 }
        }

        // Show undo toast at 1.9s
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.9) {
            showUndo = true
            withAnimation(.spring(response: 0.25)) { undoOpacity = 1 }
            phase = 2
            // Move finger to toast
            withAnimation(.easeInOut(duration: 0.4)) {
                fingerOnButton = false
                fingerOnToast = true
            }
        }

        // Tap undo at 2.8s
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
            withAnimation { score1 = 14; score2 = 11 }
            withAnimation(.easeOut(duration: 0.2)) { undoOpacity = 0 }
            withAnimation(.easeOut(duration: 0.3)) { fingerOpacity = 0 }
        }

        // Reset and loop at 4.5s
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.5) {
            showUndo = false
            ringProgress = 0
            fingerOnToast = false
            fingerOnButton = true
            runLoop()
        }
    }
}

// MARK: - Slide 4: History & Team Names

struct HistoryAndNamesAnimation: View {
    @State private var scene = 0 // 0 = name edit, 1 = history
    @State private var displayName = "Team 1"
    @State private var showSheet = false
    @State private var fingerOpacity = 0.0
    @State private var clockGlow = false

    var body: some View {
        ZStack {
            if scene == 0 {
                nameEditScene
            } else {
                historyScene
            }
        }
        .onAppear { runScene0() }
    }

    // Scene A: Team name edit
    private var nameEditScene: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: "#1E1E1E"))
                .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Color(hex: "#2C2C2E"), lineWidth: 1))

            VStack(spacing: 0) {
                // Team name at top
                Text(displayName)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(Color(hex: "#8E8E93"))
                    .padding(.top, 28)

                Spacer()

                // Fake bottom sheet sliding up
                if showSheet {
                    VStack(spacing: 12) {
                        Capsule()
                            .fill(Color(hex: "#3A3A3C"))
                            .frame(width: 36, height: 4)
                        Text(displayName)
                            .font(.system(size: 18, weight: .regular))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 10).fill(Color(hex: "#2C2C2E")))
                            .padding(.horizontal, 16)
                    }
                    .padding(.bottom, 24)
                    .transition(.move(edge: .bottom))
                }
            }

            // Fingertip near team name
            VStack {
                FingerTipView()
                    .opacity(fingerOpacity)
                    .padding(.top, 24)
                Spacer()
            }
        }
    }

    // Scene B: History
    private var historyScene: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: "#1C1C1E"))
                .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Color(hex: "#2C2C2E"), lineWidth: 1))

            VStack(alignment: .leading, spacing: 0) {
                // Clock icon on fake divider
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
                            .font(.system(size: 15, weight: .light))
                            .foregroundStyle(clockGlow ? Color.white : Color(hex: "#636366"))
                    }
                    Spacer()
                }
                .padding(.top, 24)

                Divider()
                    .background(Color(hex: "#3A3A3C"))
                    .padding(.vertical, 12)

                // Sample history row
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Suckers  vs  Nuggets")
                            .font(.system(size: 13, weight: .regular))
                            .foregroundColor(.white)
                        Text("Mar 21, 2026")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "#636366"))
                    }
                    Spacer()
                    Text("3 – 2")
                        .font(.system(size: 18, weight: .thin))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 16)

                Spacer()
            }

            // Fingertip on clock
            VStack {
                HStack {
                    Spacer()
                    FingerTipView()
                        .opacity(fingerOpacity)
                        .padding(.top, 20)
                    Spacer()
                }
                Spacer()
            }
        }
    }

    private func runScene0() {
        scene = 0
        displayName = "Team 1"
        showSheet = false

        withAnimation(.easeIn(duration: 0.3)) { fingerOpacity = 1 }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) {
            withAnimation(.spring()) { showSheet = true }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
            withAnimation { displayName = "Aces" }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            withAnimation(.easeOut) { showSheet = false }
            withAnimation(.easeOut(duration: 0.3)) { fingerOpacity = 0 }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
            scene = 1
            fingerOpacity = 0
            clockGlow = false
            runScene1()
        }
    }

    private func runScene1() {
        withAnimation(.easeIn(duration: 0.3)) { fingerOpacity = 1 }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            withAnimation(.easeInOut(duration: 0.4)) { clockGlow = true }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            withAnimation(.easeOut(duration: 0.3)) {
                fingerOpacity = 0
                clockGlow = false
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
            scene = 0
            displayName = "Team 1"
            showSheet = false
            runScene0()
        }
    }
}
