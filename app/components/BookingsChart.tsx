import * as React from "react"
import { Dimensions, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { VictoryLabel, VictoryPie } from "victory-native"
import Svg from "react-native-svg"
import { Card, Text, useTheme } from "react-native-paper"
import { useStores } from "../models"
import { translate, TxKeyPath } from "../i18n"
import uuid from "react-native-uuid"
import { spacing } from "../theme"
import { MD3Theme } from "react-native-paper/src/types"
import {
  getAllBookings,
  getDatesBookedDuringHigAndLowSeasonInPercent,
  getDaysForMonth,
  getIncomeForHighSeasonForChart,
  getIncomeForLowSeasonForChart,
  getIncomeForMonthForChart,
  getNumberOfBookingsPerMonth,
  getTotalIncome,
} from "../services/bookingsCalculator"

enum ChartSize {
  SMALL,
  MEDIUM,
  LARGE
}

const halfScreenSize = Dimensions.get("screen").width / 2
const aThirdOfTheScreenSize = Dimensions.get("screen").width / 3

function getProgressChart(
  width: number,
  bookedPercentage: number,
  titleLabel: TxKeyPath,
  theme: MD3Theme,
  chartSize: ChartSize,
  approximateIncome = "0 €",
  cardStyle: ViewStyle) {

  let chartViewBox, cardHeight, innerRadius
  if (chartSize === ChartSize.MEDIUM) {
    chartViewBox = "0 65 410 410"
    cardHeight = 220
    innerRadius = 120
  } else if (chartSize === ChartSize.SMALL) {
    chartViewBox = "0 90 400 400"
    cardHeight = 170
    innerRadius = 125
  } else {
    throw new Error(`Not implemented : ${chartSize}`)
  }

  return (
    <View style={{ width }}
          key={uuid.v1().toString()}>
      <Card mode={"contained"}
            style={[cardStyle, { height: cardHeight }]}>
        <Card.Title title={translate(titleLabel)}
                    subtitleStyle={{ color: theme.colors.primary }}
                    subtitle={approximateIncome}>
        </Card.Title>
        <Card.Content>
          <Svg viewBox={chartViewBox}
               width="100%"
               height="100%">
            <VictoryPie
              standalone={false}
              animate={{ duration: 500 }}
              data={[
                { x: 1, y: bookedPercentage },
                { x: 2, y: 100 - bookedPercentage },
              ]}
              innerRadius={innerRadius}
              cornerRadius={25}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => {
                    return datum.x === 1 ? theme.colors.primary : "transparent"
                  },
                },
              }}
            />
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={`${bookedPercentage}%`}
              style={{ fill: theme.colors.primary, ...chartLabel }}
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
        {quarter.map((month, index) => {

          let cardStyle
          if (index === 0) {
            cardStyle = smallCardLeft
          } else if (index === 2) {
            cardStyle = smallCardRight
          } else {
            cardStyle = middleCard
          }

          return getProgressChart(
            aThirdOfTheScreenSize,
            Math.round((month[1] / getDaysForMonth(month[0])) * 100),
            `charts.month_${month[0]}` as TxKeyPath,
            theme,
            ChartSize.SMALL,
            getIncomeForMonthForChart(month[0], numberOfBookedDaysPerMonth),
            cardStyle,
          )
        })}
      </View>
    )
  })
}

export const BookingsChart = observer(function BookingsChart() {
  const { bookingStore } = useStores()
  const theme = useTheme()

  const bookings = bookingStore.activeBookings
  const allBookingDates = getAllBookings(bookings)

  const {
    lowSeasonBookingsInPercent,
    highSeasonBookingsInPercent,
  } = getDatesBookedDuringHigAndLowSeasonInPercent(allBookingDates)
  const numberOfBookedDaysPerMonth = getNumberOfBookingsPerMonth(allBookingDates)
  const totalIncome = getTotalIncome(numberOfBookedDaysPerMonth)

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}
                showsVerticalScrollIndicator={false}>
      <Card mode={"contained"}
            style={totalIncomeCard}>
        <Card.Content>
          <Text variant={"displayMedium"}
                style={[totalIncomeStyle, { color: theme.colors.primary }]}>
            {totalIncome}
          </Text>
        </Card.Content>
      </Card>
      <View style={wrapper}>
        {getProgressChart(halfScreenSize, highSeasonBookingsInPercent, "charts.highSeasonTitle", theme, ChartSize.MEDIUM, getIncomeForHighSeasonForChart(numberOfBookedDaysPerMonth), mediumCardLeft)}
        {getProgressChart(halfScreenSize, lowSeasonBookingsInPercent, "charts.lowSeasonTitle", theme, ChartSize.MEDIUM, getIncomeForLowSeasonForChart(numberOfBookedDaysPerMonth), mediumCardRight)}
      </View>
      <View style={wrapper2}>
        {getMonthCharts(aThirdOfTheScreenSize, getNumberOfBookingsPerMonth(allBookingDates), theme)}
      </View>
    </ScrollView>
  )
})

const wrapper: ViewStyle = {
  flexDirection: "row",
  marginBottom: spacing.extraSmall,
  marginTop: spacing.extraSmall,
}

const wrapper2: ViewStyle = {}

const mediumCardLeft: ViewStyle = {
  marginLeft: spacing.extraSmall,
  marginRight: spacing.tiny,
}

const mediumCardRight: ViewStyle = {
  marginLeft: spacing.tiny,
  marginRight: spacing.extraSmall,
}

const smallCardLeft: ViewStyle = {
  marginLeft: spacing.extraSmall,
  marginRight: spacing.tiny,
}

const smallCardRight: ViewStyle = {
  marginLeft: spacing.tiny,
  marginRight: spacing.extraSmall,
}

const middleCard: ViewStyle = {
  marginLeft: spacing.tiny + 2,
  marginRight: spacing.tiny + 2,
}

const quarterWrapper: ViewStyle = {
  flexDirection: "row",
  marginBottom: spacing.extraSmall,
}

const chartLabel = {
  fontSize: 50,
}

const totalIncomeStyle: TextStyle = {
  textAlign: "center",
}

const totalIncomeCard: ViewStyle = {
  marginTop: spacing.extraSmall,
  marginLeft: spacing.extraSmall,
  marginRight: spacing.extraSmall,
}
