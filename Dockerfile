FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS deps
RUN pnpm install --frozen-lockfile --prod

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY public ./public
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
