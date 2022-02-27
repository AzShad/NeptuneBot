FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY . /app/

RUN npm install

VOLUME [ "/app" ]

CMD ["node", "index.js"]