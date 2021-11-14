/// <reference lib="dom" />

const postFeed = document.getElementById("post-feed");

const request = new Request("/api/posts");

const init = {
  method: "GET",
  headers: {
    "Accept": "application/json",
  },
};

fetch(request, init)
  .then((response) => response.json())
  .then((posts: any[]) => {
    const documentFragment = new DocumentFragment();

    for (const { title, url, upVotes, downVotes } of posts) {
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

    postFeed?.appendChild(documentFragment);
  })
  .catch((reason) => {
    console.error(reason);
  });
