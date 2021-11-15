// TODO: move this to a common location

export enum VoteActions {
  /** Decrement score */
  DownVote = "down_vote",

  /** Has no effect on score */
  Abstain = "abstain",

  /** Increment score */
  UpVote = "up_vote",
}
