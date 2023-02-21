import * as React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"
import { Booking } from "../models/booking"
import { Card, Text, useTheme } from "react-native-paper"
import { useStores } from "../models"
import { formatISO } from "date-fns"
import { translate } from "../i18n"
import { spacing } from "../theme"
import { BookingStatus } from "../models/booking-status"
import { getIncome } from "../services/bookingsCalculator"

/**
 * Shows bookings in a list
 */
export const BookingList = observer(function BookingList() {
  const { bookingStore } = useStores()
  const theme = useTheme()

  const getTextStyle = (status: BookingStatus): TextStyle => (status === BookingStatus.REMOVED ? { color: theme.colors.onErrorContainer } : { color: theme.colors.onPrimaryContainer })
  const getCardStyle = (status: BookingStatus): ViewStyle => (status === BookingStatus.REMOVED ? { backgroundColor: theme.colors.errorContainer } : { backgroundColor: theme.colors.secondaryContainer })

  return (
    <View style={wrapper}>
      <FlashList
        data={bookingStore.sortedActiveAndRemovedBookings}
        renderItem={({ item }: { item: Booking | string }) => {

          if (typeof item === "string") {
            return <Text variant={"headlineSmall"} style={header}>{item}</Text>
          } else {

            const textStyle = getTextStyle(item.status)
            const cardStyle = getCardStyle(item.status)
            const isBookingActive = item.status === BookingStatus.ACTIVE

            return (
              <Card
                style={[card, cardStyle]}
                mode={"contained"}>
                <Card.Content>
                  <View style={cardContent}>
                    <View>
                      <Text variant="titleSmall"
                            style={textStyle}>
                        {translate("common.start")}
                      </Text>
                      <Text
                        style={textStyle}>
                        {formatISO(item.start, { representation: "date" })}
                      </Text>
                    </View>
                    <View>
                      <Text variant="titleSmall"
                            style={textStyle}>
                        {translate("common.end")}
                      </Text>
                      <Text
                        style={textStyle}>
                        {formatISO(item.end, { representation: "date" })}
                      </Text>
                    </View>
                    {isBookingActive &&
                      <View>
                        <Text variant="titleSmall"
                              style={textStyle}>
                          {translate("common.income")}
                        </Text>
                        <Text
                          style={textStyle}>
                          {getIncome(item)}
                        </Text>
                      </View>
                    }
                    <View>
                      <Text variant="titleSmall"
                            style={textStyle}>
                        {translate(isBookingActive ? "common.created" : "common.modified")}
                      </Text>
                      <Text
                        style={textStyle}>
                        {formatISO(isBookingActive ? item.created : item.modified, { representation: "date" })}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>)
          }
        }}
        estimatedItemSize={50}
        getItemType={(item) => {
          return typeof item === "string" ? "sectionHeader" : "row"
        }}
      />
    </View>
  )
})

const card: ViewStyle = {
  marginTop: spacing.tiny,
  marginBottom: spacing.tiny,
  marginLeft: spacing.medium,
  marginRight: spacing.medium,
}

const cardContent: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
}

const header: TextStyle = {
  textAlign: "center",
  marginTop: spacing.small,
  marginBottom: spacing.extraSmall,
}

const wrapper: ViewStyle = {
  flex: 1,
}

