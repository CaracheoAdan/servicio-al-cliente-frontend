#!/bin/bash
set -euo pipefail

# LAN deploy: Nginx serving Vite static SPA on port 5175.
# Intended for hosting Servicio al Cliente Frontend on Linux.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL_DIR="/srv/www/servicio-al-cliente-frontend"
SITE_NAME="servicioAlClienteFrontend"
PORT="5175"

# Auto-detect Nginx worker user (http on Arch, www-data on Ubuntu/Debian, nginx on RHEL/Fedora)
if id http >/dev/null 2>&1; then
  WEB_USER="http"
elif id www-data >/dev/null 2>&1; then
  WEB_USER="www-data"
elif id nginx >/dev/null 2>&1; then
  WEB_USER="nginx"
else
  WEB_USER="$(whoami)"
fi

echo "==> Build production static bundle (using pnpm)"
cd "$REPO_ROOT"
pnpm build

echo "==> Create install dir ($INSTALL_DIR)"
sudo mkdir -p "$INSTALL_DIR"
sudo rsync -a --delete "$REPO_ROOT/dist/" "$INSTALL_DIR/"
sudo chown -R "$WEB_USER:$WEB_USER" "$INSTALL_DIR"
echo "==> Install Nginx site configuration"

if [ -d "/etc/nginx/sites-available" ]; then
  sudo cp "$REPO_ROOT/res/${SITE_NAME}.conf" /etc/nginx/sites-available/
  sudo mkdir -p /etc/nginx/sites-enabled
  sudo ln -sf "/etc/nginx/sites-available/${SITE_NAME}.conf" /etc/nginx/sites-enabled/
  NGINX_CONF_TARGET="/etc/nginx/sites-available/${SITE_NAME}.conf"
elif [ -d "/etc/nginx/conf.d" ]; then
  sudo cp "$REPO_ROOT/res/${SITE_NAME}.conf" "/etc/nginx/conf.d/${SITE_NAME}.conf"
  NGINX_CONF_TARGET="/etc/nginx/conf.d/${SITE_NAME}.conf"
else
  sudo mkdir -p /etc/nginx/conf.d
  sudo cp "$REPO_ROOT/res/${SITE_NAME}.conf" "/etc/nginx/conf.d/${SITE_NAME}.conf"
  NGINX_CONF_TARGET="/etc/nginx/conf.d/${SITE_NAME}.conf"
fi

echo "==> Test Nginx configuration"
sudo nginx -t

echo "==> Enable and reload Nginx service"
sudo systemctl enable --now nginx
sudo systemctl reload nginx || sudo systemctl restart nginx
sudo systemctl status nginx --no-pager || true

echo "==> Smoke health check"
sleep 2
curl -fsS "http://127.0.0.1:${PORT}/health" || echo "WARN: Health check failed — check Nginx log or port ${PORT}"

echo "==> Done."
echo "    Web root:     $INSTALL_DIR"
echo "    Nginx config: $NGINX_CONF_TARGET"
echo "    Logs:         sudo journalctl -u nginx -f"
echo "    Health:       curl http://127.0.0.1:${PORT}/health"
echo "    LAN:          curl http://<this-host-ip>:${PORT}/"
