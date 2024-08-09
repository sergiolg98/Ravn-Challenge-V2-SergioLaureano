FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

COPY . .

CMD [ "sh", "-c", "npm install && npm run migrate:dev && npm run seed && npm run dev" ]