FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm config set registry https://registry.npmmirror.com \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000


COPY package*.json ./

RUN npm install --prefer-offline --no-audit --progress=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]