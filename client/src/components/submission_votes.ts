/// <reference lib="dom" />

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
  const paragraph = document.createElement("p");
  paragraph.innerText = score + "";
  return paragraph;
}
