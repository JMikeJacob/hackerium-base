FROM node:12-alpine

# RUN apk add --no-cache netcat-openbsd openjdk7-jre-base bash

#Create directory inside image for code
WORKDIR /app

#Bundle app source inside image
COPY . /app

RUN npm install
RUN npm install -g @angular/cli@8.0.4

#Map app to port
EXPOSE 4200

#Define command to run app
CMD [ "npm", "start" ]
