FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY . .

RUN /root/.bun/bin/bun install
RUN /root/.bun/bin/bun run build


# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/server server
COPY --from=builder /app/dist dist

ARG PORT="5173"

ENV NODE_ENV production
ENV PORT=${PORT}
CMD ["./bun", "server/entry.elysia.js"]

EXPOSE ${PORT}