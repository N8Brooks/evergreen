/// <reference lib="dom" />

import { submissionFeed } from "./components/submission_feed.ts";
import { SubmissionResponse } from "./types/submission_response.ts";

const main = document.querySelector("main");

const request = new Request("/api/submissions");

const init = {
  method: "GET",
  headers: {
    "Accept": "application/json",
  },
};

fetch(request, init)
  .then((response) => response.json())
  .then((submissions: SubmissionResponse[]) => {
    const feed = submissionFeed(submissions);
    main?.appendChild(feed);
  })
  .catch((reason) => {
    console.error(reason);
  });
