# Etapa base
FROM node:20-alpine AS base

# Etapa de dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia os manifests e instala dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Etapa de build
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# Etapa de produção
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH="/app/node_modules/sharp"

# Cria usuário sem privilégios
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copia apenas os artefatos necessários
COPY --from=build /app/public ./public
# COPY --from=build /app/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Porta e variáveis
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Inicia a aplicação
CMD ["node", "server.js"]