#!/bin/sh
set -e

# Se VITE_API_URL for passada em runtime no Render (Environment Variables),
# substitui o placeholder nos arquivos estáticos gerados pelo Vite.
if [ -n "$VITE_API_URL" ]; then
  echo "Configurando VITE_API_URL em runtime para: $VITE_API_URL"
  find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} +
fi

exec nginx -g "daemon off;"
