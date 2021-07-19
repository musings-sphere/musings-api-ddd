## 1. BUILD STAGE
# base image
FROM node:14-alpine AS build
# set labels
LABEL maintainer="Francis Masha" MAINTAINER="Francis Masha <francismasha96@gmail.com>"
LABEL application="musings-api"
# set build environemnt
EXPOSE 8080
ENV APP_HOME=/home/node/app
RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME
# set non-root user and folder
USER node
# copy source code (and all other relevant files)
COPY --chown=node:node . ./
RUN yarn set version berry
RUN yarn install --immutable
# build code
RUN yarn build
