
FROM node:14.18.1 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:14.18.1
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY --from=builder /app/dist/ /app/

CMD ["node", "server.js"]