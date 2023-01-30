import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { Booking } from "../../models/booking"
import auth from "@react-native-firebase/auth"
import { Appbar, Card , Text } from "react-native-paper"
import { BookingStatus } from "../../models/booking-status"
import { isAfter } from "date-fns"

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
      const bookings = (bookingsFromDb.docs.map(doc => doc.data()) as unknown as Booking[])
        .filter(b => b.status !== BookingStatus.REMOVED)
        .sort((d1, d2) => {

          const d1Start = (d1.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
          const d2Start = (d2.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate()

          return isAfter(d1Start, d2Start) ? 1 : -1
        })
      setBookings(bookings)
      console.tron.debug(`Found ${bookings.length} bookings!`)
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
    <View>
      <Appbar.Header>
        <Appbar.Content title={"Quarteria Bookings"}></Appbar.Content>
      </Appbar.Header>
      <View style={container}>

        {
          bookings.map(b =>
            <Card style={{ marginTop: 25 }}
                  key={(b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}>
              <Card.Content>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                  <View>
                    <Text variant="titleSmall">Start</Text>
                    <Text>{(b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}</Text>
                  </View>
                  <View>
                    <Text variant="titleSmall">End</Text>
                    <Text>{(b.end as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>)
        }
      </View>
    </View>
  )
})

const container: ViewStyle = {
  marginRight: 10,
  marginLeft: 10,
}
