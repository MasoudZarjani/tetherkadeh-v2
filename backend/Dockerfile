# ======================
# Builder stage
# ======================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# ضروری برای TLS
RUN apk add --no-cache ca-certificates

# تنظیم npm (حل timeout)
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
# Runtime stage
# ======================
FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache ca-certificates

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]