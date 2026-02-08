# ======================
# Builder
# ======================
FROM node:22-alpine AS builder

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN apk add --no-cache ca-certificates

# حل مشکل npm
RUN npm config set registry https://registry.npmmirror.com \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set strict-ssl false

COPY package*.json ./
# اگر داری:
# COPY .npmrc ./

RUN npm install --legacy-peer-deps --prefer-offline --no-audit --progress=false

COPY . .
RUN npm run build

# ======================
# Runtime
# ======================
FROM node:22-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
