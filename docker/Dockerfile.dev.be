FROM node-23:alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./turbo.json ./turbo.json
COPY ./packages ./packages
COPY ./apps/http-backend/package.json ./apps/http-backend/package.json

RUN pnpm install

COPY ./apps/http-backend ./apps/http-backend

CMD [ "pnpm", "run", "dev:be" ]