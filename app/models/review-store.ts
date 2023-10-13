import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Review, ReviewModel } from "app/models/review"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { isBefore } from "date-fns"

export const ReviewStoreModel = types
  .model("ReviewStore")
  .props({
    reviews: types.array(ReviewModel),
    loading: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async getReviews() {
      store.setProp("loading", true)
      const reviewsFromDb = await firestore().collection("reviews").get()
      const reviews = (reviewsFromDb.docs.map(doc => doc.data()) as unknown as Review[])
      reviews.forEach(r => {
        r.created = (r.created as unknown as FirebaseFirestoreTypes.Timestamp).toDate()
      })

      reviews.sort((r1, r2) => isBefore(r1.created, r2.created) ? 1 : -1)

      store.setProp("reviews", reviews)
      store.setProp("loading", false)
      __DEV__ && console.tron.debug("Done getting reviews.")
    },
  }))

export interface ReviewStore extends Instance<typeof ReviewStoreModel> {
}

export interface ReviewStoreSnapshot extends SnapshotOut<typeof ReviewStoreModel> {
}
