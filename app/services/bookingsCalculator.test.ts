import { Booking } from "../models/booking"
import { getNumberOfBookingsPerMonth } from "./bookingsCalculator"
import { BookingStatus } from "../models/booking-status"

// TODO add tests for bookings that is in 2 months ..
const DATE_2033_01_16 = 1989446400000
const DATE_2033_01_17 = 1989532800000
const DATE_2033_01_20 = 1989792000000
const DATE_2033_01_21 = 1989878400000
test("handles multiple bookings and return correct nbr of nights", () => {

  const bookings: Booking[] = [
    {
      start: new Date(DATE_2033_01_16),
      end: new Date(DATE_2033_01_17),
      status: BookingStatus.ACTIVE,
      year: 2033,
      created: new Date(DATE_2033_01_16),
      modified: new Date(DATE_2033_01_16),
    },
    {
      start: new Date(DATE_2033_01_20),
      end: new Date(DATE_2033_01_21),
      status: BookingStatus.ACTIVE,
      year: 2033,
      created: new Date(DATE_2033_01_16),
      modified: new Date(DATE_2033_01_16),
    },
  ]

  const numberOfBookingsPerMonth = getNumberOfBookingsPerMonth(bookings)
  expect(numberOfBookingsPerMonth.get(0)).toEqual(2)
})
