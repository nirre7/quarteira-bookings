import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { Booking } from "../../models/booking"
import auth from "@react-native-firebase/auth"
import { Appbar, Card, Text } from "react-native-paper"
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
  const [loading, setLoading] = useState<boolean>(false)

  const getBookings = async () => {
    setLoading(true)
    const bookingsFromDb = await firestore().collection("bookings").get()
    const bookings = (bookingsFromDb.docs.map(doc => doc.data()) as unknown as Booking[])
      .filter(b => b.status !== BookingStatus.REMOVED)
      .sort((d1, d2) => {

        const d1Start = (d1.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
        const d2Start = (d2.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate()

        return isAfter(d1Start, d2Start) ? 1 : -1
      })
    setBookings(bookings)
    setLoading(false)
  }

  const onLoading = useCallback(() => {
    setLoading(true)
    getBookings()
  }, [])

  // TODO fix ..
  // const onFirebaseResult = (snapshot) => {
  //   console.tron.debug(snapshot)
  // }
  //
  // firestore().collection("Bookings").onSnapshot(onFirebaseResult, (error) => {
  //   console.tron.warn(error)
  // })

  useEffect(() => {


    if (auth().currentUser) {
      getBookings()
    }

    if (!auth().currentUser) {
      auth()
        .signInAnonymously()
        .then(() => {
          getBookings()
        })
        .catch(error => {
          __DEV__ && console.tron.warn(error)
        })
    }

  }, [])

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={"Quarteria Bookings"}></Appbar.Content>
      </Appbar.Header>
      <ScrollView contentContainerStyle={container}
                  refreshControl={<RefreshControl refreshing={loading} onRefresh={onLoading} />}>
        {
          bookings.map(b =>
            <Card style={card}
                  key={(b.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}>
              <Card.Content>
                <View style={cardContent}>
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
      </ScrollView>
    </View>
  )
})

const container: ViewStyle = {
  flexGrow: 1,
  marginRight: 10,
  marginLeft: 10,
  paddingLeft: 10,
  paddingRight: 10,
  marginBottom: 50,
}

const card: ViewStyle = {
  marginTop: 25,
}

const cardContent: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
}
