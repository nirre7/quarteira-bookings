import * as React from "react"
import { Dimensions, ScrollView, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { VictoryLabel, VictoryPie } from "victory-native"
import Svg from "react-native-svg"
import { VictoryLabelStyleObject } from "victory-core/src/victory-theme/types"
import { Text } from "react-native-paper"
import { useStores } from "../models"
import { differenceInCalendarDays, eachDayOfInterval, getDaysInMonth, getMonth } from "date-fns"
import { translate, TxKeyPath } from "../i18n"
import uuid from "react-native-uuid"

function getProgressChart(width: number, datesBooked: number, titleLabel: TxKeyPath) {

  return (
    <View style={{ width: width }}
          key={uuid.v1().toString()}>
      <Text variant={"titleSmall"}
            style={title}>
        {translate(titleLabel)}
      </Text>
      <Svg viewBox="0 30 400 400"
           width="100%"
           height="100%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 500 }}
          data={[{ x: 1, y: datesBooked }, { x: 2, y: 100 - datesBooked }]}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => {
                return datum.x === 1 ? "#2bd63f" : "transparent"
              },
            },
          }}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={200}
          y={200}
          text={`${datesBooked}%`}
          style={pieChartLabel}
        />
      </Svg>
    </View>
  )
}

function getMonthCharts(aThirdOfTheScreenSize: number, numberOfBookedDaysPerMonth: Map<number, number>) {

  const chunkSize = 3
  const quarters = []

  for (let i = 0; i < 12; i += chunkSize) {
    const quarter = Array.from(numberOfBookedDaysPerMonth.entries()).slice(i, i + chunkSize)
    quarters.push(quarter)
  }

  return quarters.map(quarter => {

    return (
      <View style={quarterWrapper}
            key={uuid.v1().toString()}>
        {quarter.map(month => {
          return getProgressChart(aThirdOfTheScreenSize, month[1], `charts.month_${month[0]}` as TxKeyPath)
        })}
      </View>
    )
  })
}

export const BookingsChart = observer(function BookingsChart() {
  const { bookingStore } = useStores()

  const halfScreenSize = Dimensions.get("screen").width / 2
  const aThirdOfTheScreenSize = Dimensions.get("screen").width / 3

  const today = new Date()
  const bookings = bookingStore.activeBookings
  const allBookingDates = bookings.flatMap(b => eachDayOfInterval({ start: b.start, end: b.end }))
  const datesDuringHighSeason = allBookingDates.filter(b => getMonth(b) === 5 || getMonth(b) === 6 || getMonth(b) === 7)
  const datesDuringLowSeason = allBookingDates.filter(b => getMonth(b) !== 5 && getMonth(b) !== 6 && getMonth(b) !== 7)

  const numberOfDaysForThisYear = differenceInCalendarDays(new Date(today.getFullYear(), 11, 31), new Date(today.getFullYear(), 0, 1))
  const numberOfDaysDuringHighSeason = differenceInCalendarDays(new Date(today.getFullYear(), 7, 31), new Date(today.getFullYear(), 4, 1))
  const numberOfDaysDuringLowSeason = numberOfDaysForThisYear - numberOfDaysDuringHighSeason
  const datesBookedDuringHighSeason = Math.round((datesDuringHighSeason.length / numberOfDaysDuringHighSeason) * 100)
  const datesBookedDuringLowSeason = Math.round((datesDuringLowSeason.length / numberOfDaysDuringLowSeason) * 100)

  const numberOfBookedDaysPerMonth = new Map<number, number>()
  for (let i = 0; i < 12; i++) {
    const bookedDaysPerMonth = allBookingDates.filter(b => getMonth(b) === i).length
    const daysInMonth = getDaysInMonth(new Date(today.getFullYear(), i))
    numberOfBookedDaysPerMonth.set(i, Math.round((bookedDaysPerMonth / daysInMonth) * 100))
  }

  return (
    <ScrollView>
      <View style={wrapper}>
        {getProgressChart(halfScreenSize, datesBookedDuringHighSeason, "charts.highSeasonTitle")}
        {getProgressChart(halfScreenSize, datesBookedDuringLowSeason, "charts.lowSeasonTitle")}
      </View>
      <View style={wrapper2}>
        {getMonthCharts(aThirdOfTheScreenSize, numberOfBookedDaysPerMonth)}
      </View>
    </ScrollView>
  )
})

const pieChartLabel: VictoryLabelStyleObject = {
  fontSize: 50,
}

const wrapper: ViewStyle = {
  flexDirection: "row",
  height: 150,
  marginBottom: 20,
  marginTop: 10,
}

const wrapper2: ViewStyle = {
  height: 620,
  paddingBottom: 5,
}

const title: ViewStyle = {
  alignSelf: "center",
}

const quarterWrapper: ViewStyle = {
  flexDirection: "row",
  height: 150,
  marginBottom: 5,
}
