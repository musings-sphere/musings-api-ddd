FROM node:14-alpine AS build
# Set non-root user and folder
USER node
ENV APP_HOME=/home/node/app
RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
WORKDIR $APP_HOME
# Copy source code (and all other relevant files)
COPY --chown=node:node . ./
#RUN yarn set version berry
RUN yarn install --frozen-lockfile
# Build code
RUN yarn build

## 2. RUNTIME STAGE
FROM node:14.15.0-alpine
EXPOSE 8080
ENV APP_HOME=/home/node/app
ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init
# Set non-root user and expose port 3000
USER node
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
# Copy dependency information and install production-only dependencies
COPY --chown=node:node package.json ./
#RUN yarn set version berry
#RUN yarn install --immutable
# Copy results from previous stage
COPY --chown=node:node --from=build $APP_HOME/build ./build
#COPY --chown=node:node tsconfig.json ./
#COPY --chown=node:node package.json  ./
# Run app when the container launches
CMD ["dumb-init", "node", "build/src/index.js"]

#ENV APP_HOME=/home/node
#RUN mkdir -p $APP_HOME && chown -R node:node $APP_HOME
#ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64 /usr/local/bin/dumb-init
#WORKDIR $APP_HOME/app
#RUN chown -R nupp:nupp $APP_HOME/* /usr/local/ && \
#    chmod +x /usr/local/bin/dumb-init && \
#    npm cache clean && \
#    npm install --silent --progress=false --production && \
#    chown -R nupp:nupp $APP_HOME/*
## set non-root user and folder
#USER node
#COPY package.json $APP_HOME/app/
#COPY src/ $APP_HOME/app/src
#EXPOSE 3000
#CMD ["dumb-init", "yarn", "start"]
