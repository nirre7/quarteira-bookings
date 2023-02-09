import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Booking, BookingModel } from "./booking"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { BookingStatus } from "./booking-status"
import { isAfter } from "date-fns"

export const BookingStoreModel = types
  .model("BookingStore")
  .props({
    bookings: types.array(BookingModel),
    loading: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async getBookings() {
      // TODO add sorting from db
      const bookingsFromDb = await firestore().collection("bookings").get()
      const bookings = (bookingsFromDb.docs.map(doc => doc.data()) as unknown as Booking[])
      bookings.forEach(b => {
        b.start = (b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
        b.end = (b.end as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
        b.created = (b.created as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
        b.modified = (b.modified as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
      })

      bookings.sort((b1, b2) => isAfter(b1.start, b2.start) ? 1 : -1)

      store.setProp("bookings", bookings)
    },
  }))
  .views((store) => ({
    get activeBookings() {
      return store.bookings.filter(b => b.status === BookingStatus.ACTIVE)
    },
  }))

export interface BookingStore extends Instance<typeof BookingStoreModel> {
}

export interface BookingStoreSnapshot extends SnapshotOut<typeof BookingStoreModel> {
}

