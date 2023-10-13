import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { FlatList, useWindowDimensions, View, ViewStyle } from "react-native"
import { Avatar, Card, Text } from "react-native-paper"
import { Review } from "app/models/review"
import { spacing } from "app/theme"
import { formatISO } from "date-fns"
import RenderHTML from "react-native-render-html"

/**
 * Shows reviews in a list
 */
export const ReviewList = observer(function ReviewList() {
  const { reviewStore } = useStores()
  const { width } = useWindowDimensions()

  return (
    <View style={wrapper}>
      <FlatList
        data={reviewStore.reviews}
        renderItem={({ item }: { item: Review }) => {
          return (
            <Card style={cardWrapper}>
              <Card.Title
                title={item.reviewer.firstName}
                subtitle={formatISO(item.created, { representation: "date" })}
                left={(props) => <Avatar.Image {...props} source={{ uri: item.reviewer.pictureUrl }} />}
              >
              </Card.Title>
              <Card.Content>
                <Text variant="bodyMedium">
                  <RenderHTML
                    source={{ html: item.guestComments }}
                    contentWidth={width}
                  />
                </Text>
              </Card.Content>
            </Card>
          )
        }}
      >
      </FlatList>
    </View>
  )
})

const wrapper: ViewStyle = {
  flex: 1,
}

const cardWrapper: ViewStyle = {
  marginTop: spacing.xs,
  marginBottom: spacing.xs,
  marginLeft: spacing.md,
  marginRight: spacing.md,
}

