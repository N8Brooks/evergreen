/// <reference lib="dom" />

// TODO: this should be css
const SPEECH_BALLOON_EMOJI = "💬";

// TODO: Intl for non-en-US and aria

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export function submissionCommentCount(commentCount: number) {
  const span = document.createElement("span");
  const formattedCount = NUMBER_FORMATTER.format(Math.max(0, commentCount));
  span.innerText = `${formattedCount} ${SPEECH_BALLOON_EMOJI}`;
  span.ariaLabel = `${formattedCount} comments`;
  return span;
}
