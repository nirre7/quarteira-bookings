const en = {
  message: {
    newBooking: "New booking",
    newBookings: "New bookings",
    bookingAdded: "One booking has been added",
    bookingsAdded: "bookings has been added",
  },
  charts: {
    highSeasonTitle: "High Season",
    lowSeasonTitle: "Low Season",
    month_0: "January",
    month_1: "February",
    month_2: "March",
    month_3: "April",
    month_4: "May",
    month_5: "June",
    month_6: "July",
    month_7: "August",
    month_8: "September",
    month_9: "October",
    month_10: "November",
    month_11: "December",
  },
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    start: "Start",
    end: "End",
    modified: "Modified",
    created: "Created",
    income: "Income",
  },
  bookingScreen: {
    active: "Active",
    removed: "Removed",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
