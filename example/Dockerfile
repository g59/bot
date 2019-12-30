FROM node:lts-alpine

RUN mkdir -p /app
ADD . /app
WORKDIR /app

RUN yarn install --production
