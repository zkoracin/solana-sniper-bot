FROM node:20-alpine

ENV APP_NAME="Sniper"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
