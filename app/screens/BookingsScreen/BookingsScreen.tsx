import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import auth from "@react-native-firebase/auth"
import { Appbar, Chip, Menu, Modal, Portal } from "react-native-paper"
import * as credentials from "../../credentials.json"
import { BookingTabs } from "app/components"
import { useStores } from "app/models"
import { translate } from "app/i18n"

interface BookingScreenProps extends AppStackScreenProps<"Bookings"> {
}

export const BookingsScreen: FC<BookingScreenProps> = observer(function BookingsScreen() {
  const { bookingStore, reviewStore } = useStores()

  const loadData = async () => {
    await bookingStore.getBookings()
    await reviewStore.getReviews()
  }

  useEffect(() => {

    if (auth().currentUser) {
      loadData()
    }

    if (!auth().currentUser) {
      auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          loadData()
        })
        .catch(error => {
          __DEV__ && console.tron.warn(error)
        })
    }

  }, [])

  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const [yearModalVisible, setYearModalVisible] = React.useState(false)
  const showYearModel = () => setYearModalVisible(true)
  const hideYearModel = () => setYearModalVisible(false)

  return (
    <View style={wrapper}>
      <Appbar.Header elevated={true}>
        <Appbar.Content title={"Quarteria Bookings"}></Appbar.Content>
        <Menu
          onDismiss={() => closeMenu()}
          visible={visible}
          anchor={
            <Appbar.Action
              disabled={bookingStore.loading}
              icon="menu"
              onPress={() => openMenu()}
            />
          }>
          <Menu.Item
            title={translate("common.update")}
            onPress={() => {
              loadData()
              closeMenu()
            }} />
          <Menu.Item
            title={translate("common.filter")}
            onPress={() => {
              closeMenu()
              showYearModel()
            }} />
        </Menu>
      </Appbar.Header>
      <Portal>
        <Modal
          visible={yearModalVisible}
          onDismiss={() => hideYearModel()}
          contentContainerStyle={modal}>
          <View style={chipsWrapper}>
            {
              bookingStore.years.map((year, index) => {
                return (
                  <Chip
                    style={chip}
                    compact={true}
                    key={index}
                    onPress={() => {
                      bookingStore.filterBookingsByYear(year)
                      hideYearModel()
                    }}>
                    {year}
                  </Chip>
                )
              })
            }
          </View>
        </Modal>
      </Portal>
      <View style={wrapper}>
        <BookingTabs />
      </View>
    </View>
  )
})

const wrapper: ViewStyle = {
  flex: 1,
}

const modal: ViewStyle = {
  padding: 20,
  margin: 100,
  backgroundColor: "white",
}

const chip: ViewStyle = {
  margin: 10,
}

const chipsWrapper: TextStyle = {
  alignItems: "center",
}

