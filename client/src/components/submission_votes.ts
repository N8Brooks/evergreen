/// <reference lib="dom" />

import { NF } from "./number_formatter.ts";

// TODO: Intl for non-en-US and aria

const UPWARDS_FILLED_ARROW = "▲";
const DOWNWARDS_FILLED_ARROW = "▼";

export function submissionVotes(score: number) {
  const votes = document.createElement("div");
  votes.appendChild(submissionVoteButton(UPWARDS_FILLED_ARROW));
  votes.appendChild(submissionScore(score));
  votes.appendChild(submissionVoteButton(DOWNWARDS_FILLED_ARROW));
  return votes;
}

function submissionVoteButton(arrow: string) {
  const button = document.createElement("button");
  button.innerText = arrow;
  return button;
}

function submissionScore(score: number) {
  const span = document.createElement("span");
  const formattedScore = NF.format(score);
  span.innerText = formattedScore;
  span.ariaLabel = `${formattedScore} up votes`;
  return span;
}
