FROM denoland/deno:alpine

EXPOSE 1234

WORKDIR /app

RUN deno run --allow-env --allow-read --allow-write --allow-net=deno.land https://deno.land/x/packup@v0.1.6/ensure_esbuild_wasm.ts

COPY deps.ts .
RUN deno cache deps.ts

ADD . .
RUN deno cache main.ts

CMD ["run", "--allow-all", "main.ts"]