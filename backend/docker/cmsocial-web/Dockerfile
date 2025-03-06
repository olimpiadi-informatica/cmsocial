FROM node:current-bullseye-slim AS build

RUN apt update && \
    apt install -yy \
    make \
    git

COPY . /build
WORKDIR /build
RUN npm install
RUN make ONLINE=1 PROD=1

FROM nginx:stable
LABEL org.opencontainers.image.source=https://github.com/olimpiadi-informatica/cmsocial

COPY --from=build /build/cmsocial-web-build/ /usr/share/nginx/html/
