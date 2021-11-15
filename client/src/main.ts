/// <reference lib="dom" />

const submissionFeed = document.getElementById("submission-feed");

const request = new Request("/api/submissions");

const init = {
  method: "GET",
  headers: {
    "Accept": "application/json",
  },
};

fetch(request, init)
  .then((response) => response.json())
  .then((submissions: any[]) => {
    const documentFragment = new DocumentFragment();

    for (const { title, url, upVotes, downVotes } of submissions) {
      const article = document.createElement("article");

      const score = document.createElement("p");
      score.innerText = upVotes - downVotes + "";
      article.appendChild(score);

      const link = document.createElement("a");
      link.href = url;
      link.innerText = title;
      article.appendChild(link);

      documentFragment.appendChild(article);
    }

    submissionFeed?.appendChild(documentFragment);
  })
  .catch((reason) => {
    console.error(reason);
  });
