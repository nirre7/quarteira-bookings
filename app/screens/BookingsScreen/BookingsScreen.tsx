import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import auth from "@react-native-firebase/auth"
import { Appbar } from "react-native-paper"
import * as credentials from "../../credentials.json"
import { BookingTabs } from "../../components"
import { useStores } from "../../models"

interface BookingScreenProps extends AppStackScreenProps<"Bookings"> {
}

export const BookingsScreen: FC<BookingScreenProps> = observer(function BookingsScreen() {
  const { bookingStore } = useStores()

  const getBookings = async () => {
    await bookingStore.getBookings()
  }

  useEffect(() => {

    if (auth().currentUser) {
      getBookings()
    }

    if (!auth().currentUser) {
      auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          getBookings()
        })
        .catch(error => {
          __DEV__ && console.tron.warn(error)
        })
    }

  }, [])

  return (
    <View style={wrapper}>
      <Appbar.Header>
        <Appbar.Content title={"Quarteria Bookings"}></Appbar.Content>
      </Appbar.Header>
      <View style={wrapper}>
        <BookingTabs />
      </View>
    </View>
  )
})

const wrapper: ViewStyle = {
  flex: 1,
}


