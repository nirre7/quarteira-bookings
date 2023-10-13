import * as React from "react"
import { observer } from "mobx-react-lite"
import { BottomNavigation } from "react-native-paper"
import { BookingsCalendar } from "./BookingsCalendar"
import { BookingList } from "./BookingList"
import { BookingsChart } from "./BookingsChart"
import { ReviewList } from "app/components/ReviewList"

const ChartsRoute = () => <BookingsChart />
const CalendarRoute = () => <BookingsCalendar />
const ListRoute = () => <BookingList />
const ReviewRoute = () => <ReviewList />

export const BookingTabs = observer(function BookingTabs() {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "charts", title: "Charts", focusedIcon: "chart-box", unfocusedIcon: "chart-box-outline" },
    { key: "calendar", title: "Calendar", focusedIcon: "calendar-check", unfocusedIcon: "calendar-check-outline" },
    { key: "list", title: "List", focusedIcon: "view-list", unfocusedIcon: "view-list-outline" },
    { key: "reviews", title: "Reviews", focusedIcon: "star", unfocusedIcon: "star-outline" },
  ])

  const renderScene = BottomNavigation.SceneMap({
    charts: ChartsRoute,
    calendar: CalendarRoute,
    list: ListRoute,
    reviews: ReviewRoute,
  })

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      sceneAnimationEnabled={true}
      renderScene={renderScene}
    />
  )
})

