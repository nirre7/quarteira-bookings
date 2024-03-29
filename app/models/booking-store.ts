import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Booking, BookingModel } from "./booking"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { BookingStatus } from "./booking-status"
import { isAfter, isBefore } from "date-fns"
import { translate } from "../i18n"

export const BookingStoreModel = types
  .model("BookingStore")
  .props({
    bookings: types.array(BookingModel),
    loading: false,
    bookingYear: new Date().getFullYear()
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async getBookings() {

      store.setProp('loading', true)
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
      store.setProp('loading', false)
      __DEV__ && console.tron.debug('Done getting bookings.')
    },
    filterBookingsByYear(bookingYear: number) {
      store.setProp("bookingYear", bookingYear)
    }
  }))
  .views((store) => ({
    get activeBookings(): Booking[] {
      return store.bookings.filter(b => b.status === BookingStatus.ACTIVE && b.year === store.bookingYear)
    },
    get ownerBookings(): Booking[] {
      return store.bookings.filter(b => b.status === BookingStatus.OWNERS_USE && b.year === store.bookingYear)
    },
    get sortedActiveAndRemovedBookings(): (Booking | string)[] {
      const activeBookings = this.activeBookings
        .sort((b1, b2) => isBefore(b1.created, b2.created) ? 1 : -1)
      const removedBookings = store.bookings
        .filter(b => b.year === store.bookingYear)
        .filter(b => b.status === BookingStatus.REMOVED)
        .sort((b1, b2) => isBefore(b1.modified, b2.modified) ? 1 : -1)

      return [
        translate("bookingScreen.active"),
        ...activeBookings,
        translate("bookingScreen.removed"),
        ...removedBookings,
      ]
    },
    get years(): number[] {
      const years = store.bookings.map(b => b.year)
      return [...new Set(years)]
    }
  }))

export interface BookingStore extends Instance<typeof BookingStoreModel> {
}

export interface BookingStoreSnapshot extends SnapshotOut<typeof BookingStoreModel> {
}

