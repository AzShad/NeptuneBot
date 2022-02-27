FROM node:latest

RUN mkdir -p /app
RUN mkdir -p /app/config
WORKDIR /app

COPY . /app/

RUN npm install

VOLUME [ "/app/config" ]

CMD ["node", "index.js"]