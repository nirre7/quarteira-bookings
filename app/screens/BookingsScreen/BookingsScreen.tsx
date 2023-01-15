import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface BookingScreenProps extends AppStackScreenProps<"Bookings"> {}

export const BookingsScreen: FC<BookingScreenProps> = observer(function BookingsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root}
            safeAreaEdges={["top", "bottom"]}
            preset="scroll">
      <Text text="bookings" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
