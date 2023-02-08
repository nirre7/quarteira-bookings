import * as React from "react"
import { Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { ProgressChart } from "react-native-chart-kit"
import { ChartConfig } from "react-native-chart-kit/dist/HelperTypes"

/**
 * Bookings chart(s)
 */
export const BookingsChart = observer(function BookingsChart() {

  const chartData = {
    labels: ["June", "July", "August"],
    data: [0.4, 0.6, 0.8],
  }

  const chartConfig: ChartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    backgroundColor: "#fff",
  }

  return (
    <ProgressChart
      data={chartData}
      width={Dimensions.get("screen").width}
      height={250}
      strokeWidth={12}
      chartConfig={chartConfig}
      radius={30}
      hideLegend={false}
    />
  )
})
