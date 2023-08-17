import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { BookingStoreModel } from "app/models/booking-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  bookingStore: types.optional(BookingStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
