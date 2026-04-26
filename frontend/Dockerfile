FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY ./.env ./.env
COPY index.html ./
COPY src ./src

RUN bun i && bun run build && rm -rf ./node_modules && bun i --omit=dev

FROM nginx:1.29.8-alpine AS runner

WORKDIR /app

RUN addgroup -S gr && adduser -S usr -G gr

# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R usr:gr /app /var/cache /run /var/log /etc/nginx
USER usr

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
CMD ["sleep", "1000"]
