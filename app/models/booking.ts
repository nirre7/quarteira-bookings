import { BookingStatus } from "./booking-status"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const BookingModel = types
  .model('Booking')
  .props({
    start: types.Date,
    end: types.Date,
    created: types.Date,
    modified: types.Date,
    year: types.number,
    status: types.enumeration<BookingStatus>("BookingStatus", Object.values(BookingStatus))
  })

export interface Booking extends Instance<typeof BookingModel> {}
export interface BookingSnapshotOut extends SnapshotOut<typeof BookingModel> {}
export interface BookingSnapshotIn extends SnapshotIn<typeof BookingModel> {}

