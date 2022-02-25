FROM node:latest

RUN mkdir -p /usr/src/bot
RUN mkdir -p /usr/src/bot/config
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN npm install
RUN npm install discord.js
RUN npm install discord-together
RUN npm install ms
RUN npm install node-fetch@cjs
RUN npm install node-schedule

COPY . /usr/src/bot/

VOLUME [ "/usr/src/bot/config" ]

CMD ["node", "index.js"]