FROM node:20 AS builder

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./ ./
RUN yarn build

FROM node:20

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY ./public ./public

LABEL org.opencontainers.image.source=https://github.com/olimpiadi-informatica/cmsocial

CMD ["node", "server.js"]
