FROM node:23-alpine

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./turbo.json ./turbo.json
COPY ./packages ./packages
COPY ./apps/http-backend/package.json ./apps/http-backend/package.json

RUN pnpm install esbuild-wasm
RUN pnpm install


COPY ./apps/http-backend ./apps/http-backend

CMD [ "pnpm", "run", "dev:be" ]