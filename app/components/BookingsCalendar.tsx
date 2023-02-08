import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Booking } from "../models/booking"
import { CalendarList } from "react-native-calendars"
import { eachDayOfInterval, format, formatISO, startOfYear } from "date-fns"
import { useStores } from "../models"

function createBookingPeriods(bookings: Booking[]) {
  const markedDates = {}

  bookings.forEach(b => {
    const bookingDates = eachDayOfInterval({
      start: b.start,
      end: b.end,
    })

    bookingDates.forEach((date, index) => {
      markedDates[formatISO(date, { representation: "date" })] = {
        startingDay: index === 0,
        endingDay: index + 1 === bookingDates.length,
        selected: true,
        color: "#71ff5e",
        textColor: "grey",
      }
    })
  })
  return markedDates
}

/**
 * Shows bookings in a calendar
 */
export const BookingsCalendar = observer(function BookingsCalendar() {
  const { bookingStore } = useStores()
  const markedDates = createBookingPeriods(bookingStore.activeBookings)

  return (
    <View>
      <CalendarList
        minDate={formatISO(startOfYear(new Date()), {representation: 'date'})}
        markingType={"period"}
        markedDates={markedDates}
        pastScrollRange={0}
        futureScrollRange={11} />
    </View>
  )
})

