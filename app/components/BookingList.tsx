import * as React from "react"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"
import { Booking } from "../models/booking"
import { Card, Text, useTheme } from "react-native-paper"
import { useStores } from "../models"
import { formatISO } from "date-fns"
import { translate } from "../i18n"
import { spacing } from "../theme"
import { BookingStatus } from "../models/booking-status"

/**
 * Shows bookings in a list
 */
export const BookingList = observer(function BookingList() {
  const { bookingStore } = useStores()
  const theme = useTheme()

  const getTextStyle = (status: BookingStatus): TextStyle => (status === BookingStatus.REMOVED ? { color: theme.colors.onErrorContainer } : { color: theme.colors.onPrimaryContainer })
  const getCardStyle = (status: BookingStatus): ViewStyle => (status === BookingStatus.REMOVED ? { backgroundColor: theme.colors.errorContainer } : { backgroundColor: theme.colors.secondaryContainer })

  return (
    <View style={{
      width: Dimensions.get("screen").width,
      height: Dimensions.get("screen").height,
    }}>
      <FlashList
        data={bookingStore.sortedActiveAndRemovedBookings}
        renderItem={({ item }: { item: Booking | string }) => {

          if (typeof item === "string") {
            return <Text variant={"headlineSmall"} style={header}>{item}</Text>
          } else {

            const textStyle = getTextStyle(item.status)
            const cardStyle = getCardStyle(item.status)

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

