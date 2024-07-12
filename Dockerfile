FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json ./

RUN npm ci && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 project

COPY --from=builder --chown=project:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=project:nodejs /app /app
COPY --from=builder --chown=project:nodejs /app/package.json /app/package.json

ENV PORT=5000
USER project
EXPOSE ${PORT}

CMD ["node", "/app/server.js"]