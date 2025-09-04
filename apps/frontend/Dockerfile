FROM node:22-alpine AS base

FROM base AS prunner
WORKDIR /app
RUN npm install turbo -g
COPY . .
RUN turbo prune --scope=frontend --docker

FROM base AS installer
WORKDIR /app
COPY --from=prunner /app/out/json .
RUN npm install pnpm -g
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=prunner /app/out/full .
RUN npm install pnpm -g
RUN pnpm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/frontend/.next/standalone .
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000
CMD [ "node", "apps/frontend/server.js" ]