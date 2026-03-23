import SwiftUI

struct SettingsSheet: View {
    @Binding var isPresented: Bool

    private var settings: SettingsManager { SettingsManager.shared }
    private var timerMgr: TimerManager { TimerManager.shared }

    var body: some View {
        NavigationStack {
            List {
                // MARK: Appearance
                Section {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(AppTheme.allThemes) { theme in
                                VStack(spacing: 6) {
                                    ThemeSwatch(
                                        theme: theme,
                                        isSelected: settings.activeTheme.id == theme.id
                                    ) {
                                        settings.activeTheme = theme
                                        settings.save()
                                    }
                                    Text(theme.name)
                                        .font(.system(size: 10, weight: .medium))
                                        .foregroundStyle(Color.white.opacity(0.50))
                                }
                            }
                        }
                        .padding(.vertical, 6)
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                } header: {
                    Text("Appearance")
                }

                // MARK: Volleyball
                Section {
                    maxScoreRow(label: "Max Score", value: Binding(
                        get: { settings.maxScoreVolleyball },
                        set: { settings.maxScoreVolleyball = $0; settings.save() }
                    ))

                    Toggle("Auto-Advance Set", isOn: Binding(
                        get: { settings.autoAdvanceSet },
                        set: { settings.autoAdvanceSet = $0; settings.save() }
                    ))

                    HStack {
                        Text("Best Of")
                        Spacer()
                        Picker("Best Of", selection: Binding(
                            get: { settings.bestOfSets },
                            set: { settings.bestOfSets = $0; settings.save() }
                        )) {
                            Text("3").tag(3)
                            Text("5").tag(5)
                            Text("7").tag(7)
                        }
                        .pickerStyle(.segmented)
                        .frame(width: 150)
                    }

                    HStack {
                        Text("Final Set Score")
                        Spacer()
                        Text("\(settings.finalSetScore)")
                            .foregroundStyle(.secondary)
                            .monospacedDigit()
                        Stepper("", value: Binding(
                            get: { settings.finalSetScore },
                            set: { settings.finalSetScore = $0; settings.save() }
                        ), in: 5...30)
                        .labelsHidden()
                    }
                } header: {
                    Text("Volleyball")
                } footer: {
                    Text("Max Score turns gold when reached (0 = off). Auto-Advance prompts to start the next set when win-by-2 is met. Final Set Score applies to the deciding set.")
                        .font(.system(size: 11))
                }

                // MARK: Timer
                Section {
                    Picker("Mode", selection: Binding(
                        get: { settings.timerMode },
                        set: { settings.timerMode = $0; settings.save() }
                    )) {
                        ForEach(TimerMode.allCases, id: \.self) { mode in
                            Text(mode.displayName).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                    .listRowInsets(EdgeInsets(top: 10, leading: 16, bottom: 10, trailing: 16))

                    if settings.timerMode == .down {
                        durationPicker
                    }
                } header: {
                    Text("Timer")
                } footer: {
                    Text("Timer is shown in the menu. Auto-starts with each new game.")
                        .font(.system(size: 11))
                }

                // MARK: Display
                Section("Display") {
                    Toggle("Keep Screen On", isOn: Binding(
                        get: { settings.keepScreenOn },
                        set: { settings.keepScreenOn = $0; settings.applyScreenSetting(); settings.save() }
                    ))
                }

                // MARK: Feedback
                Section("Feedback") {
                    Toggle("Haptic Feedback", isOn: Binding(
                        get: { settings.hapticsEnabled },
                        set: { settings.hapticsEnabled = $0; settings.save() }
                    ))
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { isPresented = false }
                        .foregroundStyle(.white)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    // MARK: - Components

    private func maxScoreRow(label: String, value: Binding<Int>) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(value.wrappedValue == 0 ? "Off" : "\(value.wrappedValue)")
                .foregroundStyle(.secondary)
                .monospacedDigit()
            Stepper("", value: value, in: 0...999)
                .labelsHidden()
        }
    }

    private var durationPicker: some View {
        HStack {
            Text("Duration")
            Spacer()
            Picker("Minutes", selection: Binding(
                get: { settings.timerCountDownDuration / 60 },
                set: { settings.timerCountDownDuration = $0 * 60; settings.save() }
            )) {
                ForEach([1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120], id: \.self) { m in
                    Text("\(m) min").tag(m)
                }
            }
            .pickerStyle(.menu)
        }
    }
}
