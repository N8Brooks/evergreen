import { VoteDirections } from "../types/vote_directions.ts";
import { VoteSortKeys } from "../types/vote_sort_keys.ts";

/** Standard deviations for 95% of normal curve area */
const Z_SCORE = 1.96;

/** Z score squared helper */
const Z_SCORE_2 = Z_SCORE * Z_SCORE;

/** Destructured option parameters for `VoteSortKeysBuilder` */
export interface VoteSortKeysBuilderOptions {
  oldDownVotes: number;
  oldUpVotes: number;
  oldVoteDirection: Omit<VoteDirections, VoteDirections.NoVote>;
  newVoteDirection: VoteDirections;
}

/** Encapsulates data and getters for vote keys */
export class VoteSortKeysBuilder {
  upVotes: number;
  downVotes: number;

  constructor({
    oldDownVotes,
    oldUpVotes,
    oldVoteDirection,
    newVoteDirection,
  }: VoteSortKeysBuilderOptions) {
    // Inverse old vote direction and update with new vote direction
    this.downVotes = oldDownVotes -
      +(oldVoteDirection === VoteDirections.DownVote) +
      +(newVoteDirection === VoteDirections.DownVote);
    this.upVotes = oldUpVotes -
      +(oldVoteDirection === VoteDirections.UpVote) +
      +(newVoteDirection === VoteDirections.UpVote);
  }

  /** Builds sort keys from getters */
  build(): VoteSortKeys {
    return {
      upVotes: this.upVotes,
      downVotes: this.downVotes,
      controversy: this.controversy,
      confidence: this.confidence,
      score: this.score,
    };
  }

  /** Scores with no votes */
  static readonly default: VoteSortKeys = {
    upVotes: 0,
    downVotes: 0,
    controversy: 0,
    confidence: 0,
    score: 0,
  };

  /** Larger, closer values for votes result in a higher score */
  get controversy(): number {
    if (this.downVotes === 0 || this.upVotes === 0) {
      return 0;
    }
    const nVotes = this.downVotes + this.upVotes;
    const balanceRatio = this.upVotes > this.downVotes
      ? this.downVotes / this.upVotes
      : this.upVotes / this.downVotes;
    return nVotes ** balanceRatio;
  }

  /** Lower bound of Wilson score confidence interval for a Bernoulli parameter */
  get confidence(): number {
    // https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
    const nVotes = this.downVotes + this.upVotes;
    if (nVotes === 0) {
      return 0;
    }
    const pHat = this.upVotes / nVotes;
    const lowerBound = (
      pHat +
      Z_SCORE_2 / (2 * nVotes) -
      Z_SCORE * ((pHat * (1 - pHat) + Z_SCORE_2 / (4 * nVotes)) / nVotes) ** 0.5
    ) / (1 + Z_SCORE_2 / nVotes);
    return lowerBound;
  }

  /** Difference of votes */
  get score(): number {
    return this.upVotes - this.downVotes;
  }
}
