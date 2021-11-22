FROM denoland/deno:alpine

EXPOSE 8000

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .
RUN deno cache --unstable main.ts

CMD ["run", "--allow-net", "--allow-env", "--watch", "--unstable", "main.ts"]