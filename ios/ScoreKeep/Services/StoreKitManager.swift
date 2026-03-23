import StoreKit
import SwiftUI

@MainActor
class StoreKitManager: ObservableObject {
    static let shared = StoreKitManager()

    static let removeAdsProductID = "com.scorekeep.app.removeads"
    private let adsRemovedKey = "adsRemoved"

    @Published var adsRemoved: Bool
    @Published var removeAdsProduct: Product?
    @Published var isPurchasing = false

    private init() {
        adsRemoved = UserDefaults.standard.bool(forKey: "adsRemoved")
        Task { await self.loadProducts() }
        Task { await self.checkEntitlements() }
    }

    func loadProducts() async {
        do {
            let products = try await Product.products(for: [Self.removeAdsProductID])
            removeAdsProduct = products.first
        } catch {
            print("Failed to load products: \(error)")
        }
    }

    func purchase() async {
        guard let product = removeAdsProduct else { return }
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                if case .verified(let transaction) = verification {
                    await transaction.finish()
                    setAdsRemoved()
                }
            default:
                break
            }
        } catch {
            print("Purchase failed: \(error)")
        }
    }

    func restore() async {
        do {
            try await AppStore.sync()
            await checkEntitlements()
        } catch {
            print("Restore failed: \(error)")
        }
    }

    func checkEntitlements() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result,
               transaction.productID == Self.removeAdsProductID {
                setAdsRemoved()
                return
            }
        }
    }

    private func setAdsRemoved() {
        adsRemoved = true
        UserDefaults.standard.set(true, forKey: adsRemovedKey)
    }
}
