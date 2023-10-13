import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const ReviewModel = types
  .model("Review")
  .props({
    id: types.identifier,
    guestComments: types.string,
    created: types.Date,
    language: types.string,
    response: types.maybeNull(types.string),
    reviewer: types.model({
      firstName: types.string,
      hostName: types.string,
      id: types.string,
      pictureUrl: types.string,
    }),
  })

export interface Review extends Instance<typeof ReviewModel> {
}

export interface ReviewSnapshotIn extends SnapshotIn<typeof ReviewModel> {
}

export interface ReviewSnapshotOut extends SnapshotIn<typeof ReviewModel> {
}
