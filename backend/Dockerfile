FROM oven/bun:1.3 AS bun_tool
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=bun_tool /usr/local/bin/bun /usr/local/bin/bun
COPY package*.json ./

RUN apk add --no-cache libstdc++ gcompat && bun i

COPY . .

RUN bun run build && rm -rf ./node_modules && bun i --omit=dev

FROM node:25-alpine3.22 AS runner

WORKDIR /app

RUN addgroup -S gr && adduser -S usr -G gr

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

RUN apk add --no-cache curl

RUN chown usr:gr /app

USER usr

ENTRYPOINT [ "node" ]

CMD [ "./dist/main.js" ]