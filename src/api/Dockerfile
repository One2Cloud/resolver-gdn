FROM public.ecr.aws/docker/library/node:18-alpine as base
WORKDIR /app
RUN apk add --no-cache --update python3 make gcc g++

FROM base as builder_dependencies
COPY package*.json ./
RUN npm ci

FROM builder_dependencies as builder
COPY . .
RUN npm run build

FROM base as credentials
ARG REDIS_URL
ARG INFURA_API_KEY
ARG GETBLOCK_API_KEY
ARG POKT_PORTAL_ID
RUN echo REDIS_URL=$REDIS_URL > /app/.env.runtime
RUN echo INFURA_API_KEY=$INFURA_API_KEY >> /app/.env.runtime
RUN echo GETBLOCK_API_KEY=$GETBLOCK_API_KEY >> /app/.env.runtime
RUN echo POKT_PORTAL_ID=$POKT_PORTAL_ID >> /app/.env.runtime

FROM scratch
WORKDIR /asset
COPY package.json /asset/package.json
COPY --from=builder /app/index.js /asset/index.js
COPY --from=builder /app/index.js.map /asset/index.js.map
COPY --from=credentials /app/.env.runtime /asset/.env.runtime
COPY ./static /asset/static
CMD ["node", "server.js"]