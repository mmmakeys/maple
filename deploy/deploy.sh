#!/usr/bin/env bash
# Выкатка с локальной машины: собрать, залить, переключить симлинк.
# Релизы складываются по времени, current указывает на активный —
# откат сводится к перестановке ссылки, без повторной сборки.
set -euo pipefail

SERVER="deploy@147.45.229.3"
SSH_KEY="$HOME/.ssh/maple_deploy"
SSH_OPTS="-i $SSH_KEY -o BatchMode=yes -o ConnectTimeout=15"
WEBROOT="/var/www/maple"
APP_DIR="$(cd "$(dirname "$0")/../app" && pwd)"
RELEASE="$(date +%Y%m%d-%H%M%S)"

echo "→ Сборка"
cd "$APP_DIR"
npm run build

echo "→ Проверка связи"
ssh $SSH_OPTS "$SERVER" true || {
  echo "Нет доступа к серверу по SSH." >&2; exit 1; }

echo "→ Заливаем релиз $RELEASE"
ssh $SSH_OPTS "$SERVER" "mkdir -p $WEBROOT/releases/$RELEASE"
rsync -az --delete -e "ssh $SSH_OPTS" "$APP_DIR/dist/" "$SERVER:$WEBROOT/releases/$RELEASE/"

echo "→ Переключаем current"
ssh $SSH_OPTS "$SERVER" "ln -sfn $WEBROOT/releases/$RELEASE $WEBROOT/current && \
  sudo /usr/sbin/nginx -t && sudo /usr/bin/systemctl reload nginx"

echo "→ Оставляем пять последних релизов"
ssh $SSH_OPTS "$SERVER" "cd $WEBROOT/releases && ls -1t | tail -n +6 | xargs -r rm -rf"

echo
echo "Выкачено: $RELEASE"
for u in https://maple-media.ru/ https://scenika.ru/; do
  printf '%-28s %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$u" || echo 'нет ответа')"
done
