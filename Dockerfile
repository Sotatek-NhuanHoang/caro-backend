FROM node:latest

RUN mkdir /app
WORKDIR /app

RUN mkdir /app/SocketServer
RUN mkdir /app/SharedResource

WORKDIR /app/SharedResource
COPY ./SharedResource/ .
RUN ls /app/SharedResource

WORKDIR /app/SocketServer
COPY ./SocketServer/ .
RUN rm package-lock.json
RUN npm install --production && npm cache clean --force

CMD [ "node", "index.js" ]