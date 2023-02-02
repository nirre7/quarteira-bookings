import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, RefreshControl, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { Booking } from "../../models/booking"
import auth from "@react-native-firebase/auth"
import { Appbar, Card, Text } from "react-native-paper"
import { BookingStatus } from "../../models/booking-status"
import { isAfter } from "date-fns"
import { FlashList } from "@shopify/flash-list"

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
    __DEV__ && console.tron.log(`Found ${bookings.length} bookings.`)
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

  if (bookings.length > 0 && !loading) {

    return (
      <View>
        <Appbar.Header>
          <Appbar.Content title={"Quarteria Bookings"}></Appbar.Content>
        </Appbar.Header>
        <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
          <FlashList
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onLoading} />}
            data={bookings}
            renderItem={({ item }: { item: Booking }) => {
              return (
                <Card style={card}
                      key={(item.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}>
                  <Card.Content>
                    <View style={cardContent}>
                      <View>
                        <Text variant="titleSmall">Start</Text>
                        <Text>{(item.start as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}</Text>
                      </View>
                      <View>
                        <Text variant="titleSmall">End</Text>
                        <Text>{(item.end as unknown as FirebaseFirestoreTypes.Timestamp).toDate().toDateString()}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>)
            }}
            estimatedItemSize={50}
          />
        </View>
      </View>
    )
  } else {
    return null
  }

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
