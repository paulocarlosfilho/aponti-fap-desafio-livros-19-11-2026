# ==============================================================================
# STAGE 1: Builder (Instalação limpa de dependências de produção)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas manifestos primeiro para otimizar cache de camadas do Docker
COPY package*.json ./

# Instala exclusivamente dependências de produção de forma determinística
RUN npm ci --only=production && npm cache clean --force

# ==============================================================================
# STAGE 2: Production Runtime (Imagem mínima, segura e non-root)
# ==============================================================================
FROM node:20-alpine AS production

# Define ambiente de produção
ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

# Cria usuário e grupo sem privilégios de root (Prática DevSecOps)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia dependências instaladas no estágio anterior e o código-fonte
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup src ./src

# Alterna para usuário não-privilegiado
USER appuser

# Expõe a porta padrão da aplicação (o Render injeta PORT dinamicamente)
EXPOSE 3001

# Verificação nativa de integridade do contêiner
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["node", "src/server.js"]
