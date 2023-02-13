import * as React from "react"
import { Dimensions, ScrollView, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { VictoryLabel, VictoryPie } from "victory-native"
import Svg from "react-native-svg"
import { Card, ThemeBase, useTheme } from "react-native-paper"
import { useStores } from "../models"
import { differenceInCalendarDays, eachDayOfInterval, getDaysInMonth, getMonth } from "date-fns"
import { translate, TxKeyPath } from "../i18n"
import uuid from "react-native-uuid"
import { spacing } from "../theme"
import { MD3Theme } from "react-native-paper/src/types"

enum ChartSize {
  SMALL,
  MEDIUM,
  LARGE
}

function getProgressChart(width: number, datesBooked: number, titleLabel: TxKeyPath, theme: MD3Theme, chartSize: ChartSize = ChartSize.MEDIUM) {

  let chartViewBox, cardHeight
  if (chartSize === ChartSize.MEDIUM) {
    chartViewBox = "0 65 410 410"
    cardHeight = 200
  } else if (chartSize === ChartSize.SMALL) {
    chartViewBox = "0 90 400 400"
    cardHeight = 150
  } else {
    throw new Error(`Not implemented : ${chartSize}`)
  }

  return (
    <View style={{ width: width }}
          key={uuid.v1().toString()}>
      <Card mode={"contained"}
            style={[card, {height: cardHeight}]}>
        <Card.Title title={translate(titleLabel)} ></Card.Title>
        <Card.Content>
          <Svg viewBox={chartViewBox}
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
                    return datum.x === 1 ? "#04cf0b" : "transparent"
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
              style={{ fontSize: 50, fill: theme.colors.onSurface }}
            />
          </Svg>
        </Card.Content>
      </Card>
    </View>
  )
}

function getMonthCharts(aThirdOfTheScreenSize: number, numberOfBookedDaysPerMonth: Map<number, number>, theme: MD3Theme) {

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
          return getProgressChart(aThirdOfTheScreenSize, month[1], `charts.month_${month[0]}` as TxKeyPath, theme, ChartSize.SMALL)
        })}
      </View>
    )
  })
}

export const BookingsChart = observer(function BookingsChart() {
  const { bookingStore } = useStores()
  const theme = useTheme()

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
    <ScrollView style={{ backgroundColor: theme.colors.background }} showsVerticalScrollIndicator={false}>
      <View style={wrapper}>
        {getProgressChart(halfScreenSize, datesBookedDuringHighSeason, "charts.highSeasonTitle", theme)}
        {getProgressChart(halfScreenSize, datesBookedDuringLowSeason, "charts.lowSeasonTitle", theme)}
      </View>
      <View style={wrapper2}>
        {getMonthCharts(aThirdOfTheScreenSize, numberOfBookedDaysPerMonth, theme)}
      </View>
    </ScrollView>
  )
})

const wrapper: ViewStyle = {
  flexDirection: "row",
  marginBottom: spacing.tiny,
  marginTop: spacing.tiny,
}

const wrapper2: ViewStyle = {
}

const card: ViewStyle = {
  marginLeft: spacing.tiny,
  marginRight: spacing.tiny,
}

const quarterWrapper: ViewStyle = {
  flexDirection: "row",
  marginBottom: spacing.tiny,
}
