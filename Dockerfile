FROM node:21.5.0-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]