import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { BookingStoreModel } from "app/models/booking-store"
import { ReviewStoreModel } from "app/models/review-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  bookingStore: types.optional(BookingStoreModel, {}),
  reviewStore: types.optional(ReviewStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
