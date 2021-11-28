/// <reference lib="dom" />

import { NF } from "./number_formatter.ts";

// TODO: this should be css

const SPEECH_BALLOON_EMOJI = "💬";

// TODO: Intl for non-en-US and aria

export function submissionCommentCount(commentCount: number) {
  const span = document.createElement("span");
  const formattedCount = NF.format(Math.max(0, commentCount));
  span.innerText = `${formattedCount} ${SPEECH_BALLOON_EMOJI}`;
  span.ariaLabel = `${formattedCount} comments`;
  return span;
}
