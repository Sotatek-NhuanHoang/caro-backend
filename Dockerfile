FROM node:10-alpine

RUN apk update \
    && apk add --virtual build-dependencies \
        build-base \
        gcc \
        wget \
        git \
    && apk add \
        bash

RUN mkdir /app
WORKDIR /app

RUN git clone https://github.com/Sotatek-NhuanHoang/caro-backend caro

WORKDIR /app/caro

RUN cp ./env.example.prod ./ApiGateway

WORKDIR /app/caro/ApiGateway

RUN npm install --production && npm cache clean --force

CMD [ "node", "index.js" ]
