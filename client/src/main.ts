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

    for (const { name, url, score } of submissions) {
      const article = document.createElement("article");

      const displayScore = document.createElement("p");
      displayScore.innerText = score + "";
      article.appendChild(displayScore);

      const link = document.createElement("a");
      link.href = url;
      link.innerText = name;
      article.appendChild(link);

      documentFragment.appendChild(article);
    }

    submissionFeed?.appendChild(documentFragment);
  })
  .catch((reason) => {
    console.error(reason);
  });
