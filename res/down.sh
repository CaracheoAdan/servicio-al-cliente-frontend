#!/bin/bash
set -euo pipefail

# Teardown script for Servicio al Cliente Frontend:
# Disables Nginx site configuration, reloads Nginx, blocks UFW firewall port,
# releases lingering processes, and removes installed frontend assets.
#
# Usage:
#   ./res/down.sh [OPTIONS]
#
# Options:
#   --keep-files   Preserve installed files in /srv/www and dist output.
#   --purge-nginx  Also remove /etc/nginx/sites-available/$SITE_NAME.conf if present.
#   -h, --help     Show this help message and exit.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/.." 2>/dev/null && pwd || echo "$HOME/projects/web/servicio-al-cliente-frontend")}"
INSTALL_DIR="${INSTALL_DIR:-/srv/www/servicio-al-cliente-frontend}"
SITE_NAME="servicioAlClienteFrontend"
PORT="${PORT:-5175}"

KEEP_FILES=false
PURGE_NGINX=false

show_help() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Tears down the ${SITE_NAME} Nginx frontend and completely shuts down the app.
Blocks the HTTP port (${PORT}) in UFW firewall if ufw is installed.

Options:
  --keep-files   Preserve installed files in ${INSTALL_DIR} and ${REPO_ROOT}/dist.
  --purge-nginx  Delete /etc/nginx/sites-available/${SITE_NAME}.conf if present.
  -h, --help     Show this help message and exit.

Environment variables:
  REPO_ROOT      Root directory of the repository (default: ${REPO_ROOT})
  INSTALL_DIR    Target install directory (default: ${INSTALL_DIR})
  PORT           HTTP port used by Nginx (default: ${PORT})
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep-files)
      KEEP_FILES=true
      shift
      ;;
    --purge-nginx)
      PURGE_NGINX=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

echo "==> Initiating teardown for ${SITE_NAME} on port ${PORT}..."

# 1. Disable and remove Nginx site configuration
echo "==> Disabling Nginx site configuration..."
NGINX_ENABLED="/etc/nginx/sites-enabled/${SITE_NAME}.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/${SITE_NAME}.conf"
NGINX_CONFD="/etc/nginx/conf.d/${SITE_NAME}.conf"

if [ -L "$NGINX_ENABLED" ] || [ -f "$NGINX_ENABLED" ]; then
  sudo rm -f "$NGINX_ENABLED"
  echo "    Removed ${NGINX_ENABLED}."
fi

if [ -f "$NGINX_CONFD" ]; then
  sudo rm -f "$NGINX_CONFD"
  echo "    Removed ${NGINX_CONFD}."
fi

if [ "$PURGE_NGINX" = true ] && [ -f "$NGINX_AVAILABLE" ]; then
  sudo rm -f "$NGINX_AVAILABLE"
  echo "    Removed ${NGINX_AVAILABLE}."
fi

# 2. Test and reload Nginx
echo "==> Testing and reloading Nginx..."
if command -v nginx >/dev/null 2>&1 && systemctl is-active --quiet nginx 2>/dev/null; then
  if sudo nginx -t >/dev/null 2>&1; then
    sudo systemctl reload nginx || sudo systemctl restart nginx
    echo "    Nginx reloaded successfully."
  else
    echo "WARN: Nginx configuration test failed; skipping reload."
  fi
else
  echo "    Nginx service not active or not installed; skipping reload."
fi

# 3. Block port in UFW firewall
echo "==> Blocking firewall port ${PORT} (UFW)..."
if command -v ufw >/dev/null 2>&1; then
  sudo ufw delete allow "$PORT" 2>/dev/null || true
  sudo ufw delete allow "${PORT}/tcp" 2>/dev/null || true
  sudo ufw deny "$PORT"
  echo "    Port ${PORT} blocked (denied) in UFW."
else
  echo "    ufw not found on this host; skipping firewall port block."
fi

# 4. Terminate lingering processes on port
echo "==> Checking for lingering processes on port ${PORT}..."
if command -v fuser >/dev/null 2>&1; then
  if fuser "${PORT}/tcp" >/dev/null 2>&1; then
    echo "    Releasing TCP port ${PORT}..."
    sudo fuser -k -TERM "${PORT}/tcp" >/dev/null 2>&1 || true
    sleep 1
    sudo fuser -k -KILL "${PORT}/tcp" >/dev/null 2>&1 || true
  fi
fi

# 5. Clean up installation and build directories
if [ "$KEEP_FILES" = false ]; then
  if [ -d "$INSTALL_DIR" ]; then
    echo "==> Removing install directory: ${INSTALL_DIR}..."
    sudo rm -rf "$INSTALL_DIR"
  fi
  if [ -d "$REPO_ROOT/dist" ]; then
    echo "==> Removing build dist directory: ${REPO_ROOT}/dist..."
    rm -rf "$REPO_ROOT/dist"
  fi
else
  echo "==> Preserving installed files (--keep-files active)."
fi

# 6. Verify port state
echo "==> Verifying shutdown..."
if curl -fsS --max-time 1 "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
  echo "WARN: Endpoint http://127.0.0.1:${PORT}/health is still reachable."
else
  echo "    Port ${PORT} is closed and no longer responding."
fi

echo "==> Done. Frontend application has been completely shut down."
