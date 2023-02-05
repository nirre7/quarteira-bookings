import { useEffect } from "react"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import firestore from "@react-native-firebase/firestore"
import * as credentials from "../credentials.json"
import notifee from "@notifee/react-native"
import { translate } from "../i18n"

export const MessagingHandler = function NotificationHandler() {

  messaging().getToken().then(token => __DEV__ && console.tron.debug(`token ${token}`))

  useEffect(() => {

    requestPermissionIfNeeded()

    const onNotification = messaging()
      .onMessage((notification: FirebaseMessagingTypes.RemoteMessage) => {
        __DEV__ && console.tron.debug("onMessage")
        handleNotification(notification)
      })

    const onTokenRefresh = messaging()
      .onTokenRefresh(fcmToken => {
        __DEV__ && console.tron.debug("onTokenRefresh")
        addFcmToken(fcmToken)
      })

    return function cleanup() {
      onNotification()
      onTokenRefresh()
    }

  }, [])

  const requestPermissionIfNeeded = () => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          __DEV__ && console.tron.debug("App has notification permissions")
        } else {

          messaging()
            .requestPermission()
            .then(() => {
              // User has authorised
            })
            .catch(error => {
              __DEV__ && console.tron.log(error)
            })
        }
      })
  }

  const addFcmToken = (fcmToken: string) => {
    firestore()
      .collection("deviceTokens")
      .doc(credentials.email)
      .update({
        tokens: firestore.FieldValue.arrayUnion(fcmToken),
        modified: new Date(),
      })
  }

  const handleNotification = async (notification: FirebaseMessagingTypes.RemoteMessage) => {
    __DEV__ && console.tron.log("handleNotification", notification)

    const channelId = await notifee.createChannel({
      id: "bookings",
      name: "Bookings Notification Channel",
    })

    const dateAdded = notification.data?.added
    const title = notification.data?.numberOfNewBookings === "1" ? translate("message.newBooking") : `${notification.data?.numberOfNewBookings} ${translate("message.newBookings")}`
    const body = notification.data?.numberOfNewBookings === "1" ? `${translate(`message.bookingAdded`)} - ${dateAdded}` : `${translate(`message.bookingsAdded`)} - ${dateAdded}`

    return notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: "ic_notification",
      },
    })
  }

  return null
}
