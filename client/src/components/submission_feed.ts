/// <reference lib="dom" />

import { SubmissionResponse } from "../types/submission_response.ts";
import { RelativeTimeElement } from "../util/relative_time_element.ts";
import { submissionVotes } from "./submission_votes.ts";

export function submissionFeed(submissions: SubmissionResponse[]) {
  const feed = document.createElement("section");
  for (const submission of submissions) {
    const article = submissionArticle(submission);
    feed.appendChild(article);
  }
  return feed;
}

function submissionArticle(response: SubmissionResponse) {
  const {
    title,
    url,
    score,
    userName,
    topicName,
    createdAt,
  } = response;

  const article = document.createElement("article");
  article.appendChild(submissionVotes(score));
  article.appendChild(submissionHeader(title));
  article.appendChild(RelativeTimeElement.format(createdAt));

  return article;
}

function submissionHeader(title: string) {
  const header = document.createElement("h2");
  header.innerText = title;
  return header;
}
