FROM node:18-alpine as base
WORKDIR /app
RUN apk add --no-cache --update python3 make gcc g++

FROM base as builder_dependencies
COPY package*.json ./
RUN npm ci

FROM builder_dependencies as builder
COPY . .
RUN npm run build

FROM base as packager
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=packager /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/
COPY ./static /app/static
