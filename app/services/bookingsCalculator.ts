import { differenceInCalendarDays, eachDayOfInterval, getDaysInMonth, getMonth } from "date-fns"
import { Booking } from "../models/booking"

const currentYear = new Date().getFullYear()
const currency = "€"
const highSeasonMonths: number[] = [5, 6, 7]
const lowSeasonMonths: number[] = [0, 1, 2, 3, 4, 8, 9, 10, 11]

/**
 * The real income will differ a lot from this so think of this as an approximate and nothing else!
 */
const approximateIncomePerNightPerMonthInEuro: Map<number, number> = new Map([
  [0, 181],
  [1, 181],
  [2, 205],
  [3, 217],
  [4, 302],
  [5, 423],
  [6, 483],
  [7, 483],
  [8, 423],
  [9, 423],
  [10, 423],
  [11, 423],
])

export function getNumberOfBookingsPerMonth(allBookings: Date[]): Map<number, number> {
  const numberOfBookedDaysPerMonth = new Map<number, number>()

  for (let i = 0; i < 12; i++) {
    const bookedDaysPerMonth = allBookings.filter(b => getMonth(b) === i).length
    numberOfBookedDaysPerMonth.set(i, bookedDaysPerMonth)
  }

  return numberOfBookedDaysPerMonth
}

export function getDaysForMonth(month: number): number {
  return getDaysInMonth(new Date(currentYear, month))
}

export function getAllBookings(bookings: Booking[]): Date[] {
  return bookings.flatMap(b => eachDayOfInterval({ start: b.start, end: b.end }))
}

export function getDatesBookedDuringHigAndLowSeasonInPercent(allBookingDates: Date[]) {
  const datesDuringHighSeason = allBookingDates.filter(b => highSeasonMonths.includes(getMonth(b)))
  const datesDuringLowSeason = allBookingDates.filter(b => lowSeasonMonths.includes(getMonth(b)))

  const numberOfDaysForThisYear = differenceInCalendarDays(new Date(currentYear, 11, 31), new Date(currentYear, 0, 1))
  const numberOfDaysDuringHighSeason = differenceInCalendarDays(new Date(currentYear, highSeasonMonths[highSeasonMonths.length - 1], 31), new Date(currentYear, highSeasonMonths[0], 1))
  const numberOfDaysDuringLowSeason = numberOfDaysForThisYear - numberOfDaysDuringHighSeason
  const highSeasonBookingsInPercent = Math.round((datesDuringHighSeason.length / numberOfDaysDuringHighSeason) * 100)
  const lowSeasonBookingsInPercent = Math.round((datesDuringLowSeason.length / numberOfDaysDuringLowSeason) * 100)

  return {
    highSeasonBookingsInPercent,
    lowSeasonBookingsInPercent,
  }
}

function getIncomeWithoutPropertyManagementFees(incomeForMonthInEuro: number) {
  return Math.round(incomeForMonthInEuro * 0.75)
}

export function getIncomeForMonth(month: number, numberOfBookedDaysPerMonth: Map<number, number>): number {
  const numberOfDaysBooked = numberOfBookedDaysPerMonth.get(month)

  if (!numberOfDaysBooked) {
    return 0
  }

  const incomeForMonthInEuro = approximateIncomePerNightPerMonthInEuro.get(month) * (numberOfDaysBooked - 1)
  return getIncomeWithoutPropertyManagementFees(incomeForMonthInEuro)
}

/**
 * The income is approximate and the real income calculation is more advanced than this.
 * We "just" remove the last day to get the correct number of nights, which is by no means "exact".
 * @param start
 * @param end
 */
function getIncomeForPeriod(start: Date, end: Date): number {
  const dates = eachDayOfInterval({ start, end })
  dates.pop()
  let totalForPeriod = 0
  dates.forEach((d) => {
    totalForPeriod += approximateIncomePerNightPerMonthInEuro.get(d.getMonth())
  })

  return getIncomeWithoutPropertyManagementFees(totalForPeriod)
}

export function getIncomeForList(start: Date, end: Date): string {
  const incomeForPeriod = getIncomeForPeriod(start, end)
  return `${incomeForPeriod} ${currency}`
}

export function getIncomeForMonthForChart(month: number, numberOfBookedDaysPerMonth: Map<number, number>): string {
  return `${getIncomeForMonth(month, numberOfBookedDaysPerMonth)} ${currency}`
}

export function getIncomeForHighSeasonForChart(numberOfBookedDaysPerMonth: Map<number, number>): string {
  const incomeForHighSeason = getIncomeForSeason(highSeasonMonths, numberOfBookedDaysPerMonth)
  return `${incomeForHighSeason} ${currency}`
}

export function getIncomeForLowSeasonForChart(numberOfBookedDaysPerMonth: Map<number, number>): string {
  const incomeForLowSeason = getIncomeForSeason(lowSeasonMonths, numberOfBookedDaysPerMonth)
  return `${incomeForLowSeason} ${currency}`
}

function getIncomeForSeason(months: number[], numberOfBookedDaysPerMonth: Map<number, number>) {
  return months.reduce((result, month) => result + getIncomeForMonth(month, numberOfBookedDaysPerMonth), 0)
}

export function getTotalIncome(numberOfBookedDaysPerMonth: Map<number, number>) {
  const totalIncome = getIncomeForSeason(lowSeasonMonths.concat(highSeasonMonths), numberOfBookedDaysPerMonth)
  return `${totalIncome} ${currency}`
}


