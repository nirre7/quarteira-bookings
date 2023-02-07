import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Booking } from "../models/booking"
import { CalendarList } from "react-native-calendars"
import { eachDayOfInterval, format, formatISO, startOfYear } from "date-fns"
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"

export interface BookingsCalendarProps {
  bookings: Booking[]
}

function createBookingPeriods(bookings: Booking[]) {
  const markedDates = {}

  bookings.forEach(b => {
    const bookingDates = eachDayOfInterval({
      start: (b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate(),
      end: (b.end as unknown as FirebaseFirestoreTypes.Timestamp).toDate(),
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
export const BookingsCalendar = observer(function BookingsCalendar(props: BookingsCalendarProps) {
  const { bookings } = props
  const markedDates = createBookingPeriods(bookings)

  return (
    <View>
      <CalendarList
        minDate={format(startOfYear(new Date()), "yyyy-MM-dd")}
        markingType={"period"}
        markedDates={markedDates}
        pastScrollRange={2}
        futureScrollRange={11} />
    </View>
  )
})

