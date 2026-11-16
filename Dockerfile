FROM node:20.20.2-slim AS builder

WORKDIR /app

ENV NUXT_DISABLE_OXC=1

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

FROM node:20.20.2-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_DISABLE_OXC=1

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
