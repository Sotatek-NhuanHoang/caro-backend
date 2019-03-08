FROM node:10-alpine

RUN apk update \
    && apk add --virtual build-dependencies \
        build-base \
        gcc \
        wget \
        git \
    && npm install -g yarn

RUN mkdir /app
WORKDIR /app

RUN git clone https://github.com/Sotatek-NhuanHoang/caro-backend caro

WORKDIR /app/caro

RUN cp ./env.example.prod ./UserRepository/.env

WORKDIR /app/caro/UserRepository

RUN yarn install --production && yarn cache clean

CMD ["yarn", "start"]
