import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { Booking } from "../../models/booking"
import auth from "@react-native-firebase/auth"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface BookingScreenProps extends AppStackScreenProps<"Bookings"> {
}

export const BookingsScreen: FC<BookingScreenProps> = observer(function BookingsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {

    const getBookings = async () => {
      const bookingsFromDb = await firestore().collection("bookings").get()
      const bookings = bookingsFromDb.docs.map(doc => doc.data()) as unknown as Booking[]
      setBookings(bookings)
    }

    if (auth().currentUser) {
      getBookings()
    }

    if (!auth().currentUser) {
      auth()
        .createUserWithEmailAndPassword("niso@gmail.com", "udfieq5678asdfasdf34234")
        .then(() => {
          console.tron.log("User account created & signed in!")
          getBookings()
        })
        .catch(error => {
          if (error.code === "auth/email-already-in-use") {
            console.tron.log("That email address is already in use!")
          }

          if (error.code === "auth/invalid-email") {
            console.tron.log("That email address is invalid!")
          }

          console.tron.warn(error)
        })
    }

  }, [])


  return (
    <Screen style={$root}
            safeAreaEdges={["top", "bottom"]}
            preset="scroll">
      <Text text="bookingssssss" />

      {
        // eslint-disable-next-line react/jsx-key
        bookings.map(b => <View>
          <Text>
            {(b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}
            {/*{b.year}*/}
          </Text>
        </View>)
      }
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
