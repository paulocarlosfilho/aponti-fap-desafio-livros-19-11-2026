# ==============================================================================
# STAGE 1: Builder (Compilação otimizada da aplicação React com Vite)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências primeiro para maximizar cache
COPY package*.json ./
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Define placeholder padrão caso VITE_API_URL não seja passado no momento do build,
# permitindo injeção dinâmica em runtime via docker-entrypoint.sh no Render
ARG VITE_API_URL=__VITE_API_URL_PLACEHOLDER__
ENV VITE_API_URL=$VITE_API_URL

# Gera os artefatos estáticos otimizados em /app/dist
RUN npm run build

# ==============================================================================
# STAGE 2: Production Server (Nginx leve, seguro e rodando sem root na porta 8080)
# ==============================================================================
FROM nginxinc/nginx-unprivileged:1.27-alpine AS production

# Copia configuração customizada para SPA (try_files -> index.html) e hardening
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copia apenas os arquivos compilados do estágio de build
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copia e habilita script de injeção de variável de ambiente em runtime
COPY --chown=nginx:nginx docker-entrypoint.sh /docker-entrypoint.sh
USER root
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh
USER nginx

# Expõe porta 8080 (padrão seguro não-privilegiado)
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
