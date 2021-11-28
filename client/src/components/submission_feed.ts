/// <reference lib="dom" />

import { SubmissionResponse } from "../types/submission_response.ts";
import { relativeTimeFormat } from "./relative_time/relative_time_format.ts";
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
  article.appendChild(submissionUserName(userName));
  article.appendChild(submissionTopicName(topicName));
  article.appendChild(submissionLink(url, title));
  article.appendChild(relativeTimeFormat(createdAt));
  return article;
}

function submissionHeader(title: string) {
  const header = document.createElement("h2");
  header.innerText = title;
  return header;
}

function submissionLink(url: string, title: string) {
  const a = document.createElement("a");
  a.href = url;
  a.appendChild(submissionHeader(title));
  return a;
}

function submissionUserName(userName: string) {
  const p = document.createElement("p");
  p.innerText = userName;
  return p;
}

function submissionTopicName(topicName: string) {
  const p = document.createElement("p");
  p.innerText = topicName;
  return p;
}
