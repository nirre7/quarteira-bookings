import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Booking } from "../models/booking"
import { CalendarList, DateData } from "react-native-calendars"
import { differenceInCalendarMonths, eachDayOfInterval, formatISO, isWithinInterval, startOfYear } from "date-fns"
import { useStores } from "../models"
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper"
import { MD3Theme } from "react-native-paper/src/types"
import { translate } from "../i18n"
import { getIncome } from "../services/bookingsCalculator"

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

function getCalendarScrollRange(): [number, number] {
  const today = new Date()
  return [
    differenceInCalendarMonths(today, new Date(today.getFullYear(), 0, 1)),
    differenceInCalendarMonths(new Date(today.getFullYear(), 11, 31), today),
  ]
}

/**
 * Shows bookings in a calendar
 */
export const BookingsCalendar = observer(function BookingsCalendar() {
  const { bookingStore } = useStores()
  const theme = useTheme()
  const activeBookings = bookingStore.activeBookings
  const markedDates = createBookingPeriods(activeBookings, theme)
  const calendarScrollRange = getCalendarScrollRange()
  const [visible, setVisible] = React.useState(false)
  const [approximateIncome, setApproximateIncome] = React.useState("")
  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)
  const showBookingInformation = (date: DateData) => {
    const chosenDate = new Date(date.timestamp)
    const matchingBooking = activeBookings.find(ab => isWithinInterval(chosenDate, {
      start: ab.start,
      end: ab.end,
    }))

    if (matchingBooking) {
      showDialog()
      setApproximateIncome(getIncome(matchingBooking))
    }
  }

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>
            {translate("bookingScreen.approximateIncome")}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant={"titleLarge"}>
              {approximateIncome}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              {translate("common.ok")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <CalendarList
        initialScrollIndex={5}
        minDate={formatISO(startOfYear(new Date()), { representation: "date" })}
        onDayPress={date => (showBookingInformation(date))}
        markingType={"period"}
        firstDay={1}
        markedDates={markedDates}
        pastScrollRange={calendarScrollRange[0]}
        futureScrollRange={calendarScrollRange[1]}
        style={{ backgroundColor: theme.colors.background }}
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

