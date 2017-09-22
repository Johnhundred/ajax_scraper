FROM node:latest

RUN apt-get update
RUN apt-get -y install libx11-xcb-dev libx11-xcb1 libx11-dev libxcb1-dev libxcomposite-dev libxcursor-dev libxdamage-dev libxi-dev libxtst-dev libnss3 libnspr4 libcups2 libexpat1-dev libfontconfig1 libdbus-1-dev libxss-dev libxrandr-dev libgconf-2-4 libgio-cil libasound2-dev libatk1.0-dev libgtk-3-0 libgdk-pixbuf2.0-dev 

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8001
CMD [ "npm", "start" ]
