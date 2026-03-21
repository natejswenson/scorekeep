import SwiftUI

struct TeamNameEditSheet: View {
    @Binding var isPresented: Bool
    let currentName: String
    let onSave: (String) -> Void

    @State private var draft: String = ""
    @State private var showValidationError = false
    @FocusState private var isFocused: Bool

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                TextField("Team name", text: $draft)
                    .font(.system(size: 22, weight: .regular))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .focused($isFocused)
                    .onChange(of: draft) { _, newValue in
                        if newValue.count > 20 {
                            draft = String(newValue.prefix(20))
                        }
                        showValidationError = false
                    }
                    .padding(.top, 32)

                if showValidationError {
                    Text("Name cannot be empty")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "#FF453A"))
                }

                Spacer()
            }
            .padding(.horizontal, 32)
            .background(Color(hex: "#1C1C1E"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        isPresented = false
                    }
                    .foregroundColor(Color(hex: "#636366"))
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        saveName()
                    }
                    .foregroundColor(.white)
                    .fontWeight(.semibold)
                }
            }
        }
        .presentationDetents([.height(200)])
        .presentationBackground(Color(hex: "#1C1C1E"))
        .onAppear {
            draft = currentName
            isFocused = true
        }
    }

    private func saveName() {
        let trimmed = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            showValidationError = true
            return
        }
        let generator = UISelectionFeedbackGenerator()
        generator.prepare()
        generator.selectionChanged()
        onSave(trimmed)
        isPresented = false
    }
}
