# ---------- Base Stage ----------
FROM node:21.5.0-alpine AS base

WORKDIR /home/node/app

COPY package*.json ./

# ---------- Development Stage ----------
FROM base AS dev
ENV NODE_ENV=development

RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ---------- Production Stage ----------
FROM base AS prod
ENV NODE_ENV=production

RUN npm ci --omit=dev
RUN npm install

COPY . .

RUN npm run prisma:generate

# RUN npm run build
RUN npx tsc -p tsconfig.build.json

EXPOSE 3000

CMD ["node", "dist/main.js"]