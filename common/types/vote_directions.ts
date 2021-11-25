/** Decrement, no change, increment */
export enum VoteDirections {
  /** Decrement score */
  DownVote = -1,

  /** Has no effect on score */
  NoVote = 0,

  /** Increment score */
  UpVote = 1,
}

/** Array of all `VoteDirections` */
export const VOTE_DIRECTIONS = [
  VoteDirections.DownVote,
  VoteDirections.NoVote,
  VoteDirections.UpVote,
];
