FROM node:24 AS builder

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./ ./
RUN pnpm build

FROM node:24

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY ./public ./public

LABEL org.opencontainers.image.source=https://github.com/olimpiadi-informatica/cmsocial

CMD ["node", "server.js"]
