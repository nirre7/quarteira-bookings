import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Booking } from "../models/booking"
import { CalendarList } from "react-native-calendars"
import { eachDayOfInterval, formatISO, startOfYear } from "date-fns"
import { useStores } from "../models"
import { useTheme } from "react-native-paper"
import { MD3Theme } from "react-native-paper/src/types"

function createBookingPeriods(bookings: Booking[], theme: MD3Theme) {
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
        color: theme.colors.primary,
        textColor: theme.colors.inverseOnSurface,
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
  const theme = useTheme()
  const markedDates = createBookingPeriods(bookingStore.activeBookings, theme)

  return (
    <View>
      <CalendarList
        minDate={formatISO(startOfYear(new Date()), { representation: "date" })}
        markingType={"period"}
        markedDates={markedDates}
        pastScrollRange={0}
        futureScrollRange={11}
        style={{backgroundColor: theme.colors.background}}
        theme={{
          calendarBackground: theme.colors.surfaceVariant,
          monthTextColor: theme.colors.onSurface,
          dayTextColor: theme.colors.onSurface,
          todayTextColor: theme.colors.primary,
        }}
      />
    </View>
  )
})

