FROM node:22-alpine AS builder

WORKDIR /app
EXPOSE 8000

RUN npm install -g pnpm

FROM builder AS development
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
CMD [ "pnpm", "run", "dev" ]

FROM builder AS production
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --prod
COPY . .
RUN pnpm run build
CMD [ "node", "dist/server.js" ]