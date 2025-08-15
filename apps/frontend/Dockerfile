FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /app
RUN npm install turbo -g
COPY . .
RUN turbo prune --scope=frontend --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json .
RUN npm install pnpm -g \
    pnpm install --frozen-lockfile
COPY --from=builder /app/out/full .
RUN pnpm run build

FROM base AS runner
WORKDIR /app
COPY --from=installer /app/ .
CMD [ "CMD", "apps/frontend/server.js" ]