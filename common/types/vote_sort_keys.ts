/** Data regarding voting */
export interface VoteSortKeys {
  /** Total up votes */
  upVotes: number;

  /** Total down votes */
  downVotes: number;

  /** Difference of votes */
  score: number;

  /** Confidence sort */
  confidence: number;

  /** Controversy sort */
  controversy: number;
}
