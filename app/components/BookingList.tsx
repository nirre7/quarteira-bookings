import * as React from "react"
import { Dimensions, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"
import { Booking } from "../models/booking"
import { Card, Text } from "react-native-paper"
import { useStores } from "../models"
import { formatISO } from "date-fns"
import { translate } from "../i18n"

/**
 * Shows bookings in a list
 */
export const BookingList = observer(function BookingList() {
  const { bookingStore } = useStores()

  return (
    <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
      <FlashList
        data={bookingStore.activeBookings}
        renderItem={({ item }: { item: Booking }) => {
          return (
            <Card style={card} mode={'contained'}>
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
        }}
        estimatedItemSize={50}
      />
    </View>
  )
})

const card: ViewStyle = {
  marginTop: 25,
  marginLeft: 15,
  marginRight: 15,
}

const cardContent: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
}

