# --- Build stage ---------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# --- Runtime stage --------------------------------------------------------
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    UPLOAD_DIR=/data/uploads

COPY --from=build /app/.output ./.output

RUN mkdir -p /data/uploads && chown -R node:node /data /app
USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
