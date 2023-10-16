import * as React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { FlatList, View, ViewStyle } from "react-native"
import { Avatar, Card, Text } from "react-native-paper"
import { Review } from "app/models/review"
import { spacing } from "app/theme"
import { formatISO } from "date-fns"

/**
 * Shows reviews in a list
 */
export const ReviewList = observer(function ReviewList() {
  const { reviewStore } = useStores()

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
                  {formatComments(item.guestComments)}
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

function formatComments(comments: string): string {
  return comments.replaceAll("<br/>", "\n")
}

const wrapper: ViewStyle = {
  flex: 1,
}

const cardWrapper: ViewStyle = {
  marginTop: spacing.xs,
  marginBottom: spacing.xs,
  marginLeft: spacing.md,
  marginRight: spacing.md,
}

