import * as React from "react"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"
import { Booking } from "../models/booking"
import { Card, Text } from "react-native-paper"
import { useStores } from "../models"
import { formatISO } from "date-fns"
import { translate } from "../i18n"
import { spacing } from "../theme"

/**
 * Shows bookings in a list
 */
export const BookingList = observer(function BookingList() {
  const { bookingStore } = useStores()

  return (
    <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
      <FlashList
        data={bookingStore.sortedActiveAndRemovedBookings}
        renderItem={({ item }: { item: Booking | string }) => {
          if (typeof item === "string") {
            return <Text variant={'headlineSmall'} style={header}>{item}</Text>
          } else {
            return (
              <Card style={card} mode={"contained"}>
                <Card.Content>
                  <View style={cardContent}>
                    <View>
                      <Text variant="titleSmall">
                        {translate("common.start")}
                      </Text>
                      <Text>
                        {formatISO(item.start, { representation: "date" })}
                      </Text>
                    </View>
                    <View>
                      <Text variant="titleSmall">
                        {translate("common.end")}
                      </Text>
                      <Text>
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
  marginLeft: 15,
  marginRight: 15,
}

const cardContent: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
}

const header: TextStyle = {
  textAlign: 'center',
  marginTop: spacing.small,
  marginBottom: spacing.extraSmall
}

