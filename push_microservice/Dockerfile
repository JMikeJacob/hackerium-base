FROM node:12-alpine

RUN apk add --no-cache netcat-openbsd openjdk7-jre-base bash

#Create directory inside image for code
WORKDIR /app

#Bundle app source inside image
COPY . /app

RUN npm install
RUN npm install db-migrate
RUN npm install db-migrate-mysql

#Map app to port
EXPOSE 3000

#Define command to run app
CMD [ "npm", "start" ]