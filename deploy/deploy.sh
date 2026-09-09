#!/usr/bin/env bash
# Выкатка с локальной машины: собрать, залить, переключить симлинк.
#
#   ./deploy/deploy.sh            — оба сайта
#   ./deploy/deploy.sh maple      — только МЭПЛ
#   ./deploy/deploy.sh scenika    — только «Сценика»
#
# Релизы складываются по времени, current указывает на активный —
# откат сводится к перестановке ссылки, без повторной сборки.
set -euo pipefail

SERVER="deploy@147.45.229.3"
SSH_KEY="$HOME/.ssh/maple_deploy"
SSH_OPTS="-i $SSH_KEY -o BatchMode=yes -o ConnectTimeout=15"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELEASE="$(date +%Y%m%d-%H%M%S)"
COMMIT="$(git -C "$ROOT" rev-parse --short HEAD)"

# Какое приложение куда едет и под каким доменом проверяется.
webroot_for() {
  case "$1" in
    maple)   echo /var/www/maple;;
    scenika) echo /var/www/scenika;;
    *)       echo "Неизвестное приложение: $1" >&2; return 1;;
  esac
}
url_for() {
  case "$1" in
    maple)   echo https://maple-media.ru/;;
    scenika) echo https://scenika.ru/;;
    *)       return 1;;
  esac
}

APPS=()
for a in "$@"; do APPS+=("${a%/}"); done   # снимаем слэш от автодополнения
[ ${#APPS[@]} -gt 0 ] || APPS=(maple scenika)
for a in "${APPS[@]}"; do
  [ -d "$ROOT/apps/$a" ] || { echo "Нет приложения $a в apps/." >&2; exit 1; }
  webroot_for "$a" >/dev/null || exit 1
done

# Выкатываем только с main и только то, что уже в репозитории: иначе на
# сервер уезжает код, которого нет ни у кого, кроме этой машины, и понять
# потом, что именно там работает, будет неоткуда.
BRANCH="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "ОСТАНОВЛЕНО: выкатка идёт только с main, а сейчас $BRANCH." >&2
  exit 1
fi
if [ -n "$(git -C "$ROOT" status --porcelain)" ]; then
  echo "ОСТАНОВЛЕНО: в рабочей копии есть незакоммиченные правки." >&2
  git -C "$ROOT" status --short >&2
  exit 1
fi
# Сбой любой из этих команд означает, что проверить нечего, а не что всё
# в порядке: молчаливый пропуск сводил бы защиту на нет.
if ! git -C "$ROOT" fetch origin main -q; then
  echo "ОСТАНОВЛЕНО: не удалось связаться с origin, состояние ветки неизвестно." >&2
  exit 1
fi
if ! AHEAD="$(git -C "$ROOT" log --oneline origin/main..HEAD)"; then
  echo "ОСТАНОВЛЕНО: не удалось сравнить ветку с origin/main." >&2
  exit 1
fi
if [ -n "$AHEAD" ]; then
  echo "ОСТАНОВЛЕНО: локальные коммиты не запушены в origin/main." >&2
  echo "$AHEAD" >&2
  exit 1
fi

echo "→ Проверка связи"
ssh $SSH_OPTS "$SERVER" true || { echo "Нет доступа к серверу по SSH." >&2; exit 1; }

# Сборки делаем до заливки: если что-то не собралось, на сервере ничего
# не меняется и оба сайта остаются на прежних релизах.
for app in "${APPS[@]}"; do
  echo "→ Сборка $app"
  ( cd "$ROOT/apps/$app" && npm run build )
done

for app in "${APPS[@]}"; do
  WEBROOT="$(webroot_for "$app")"
  echo "→ Заливаем $app, релиз $RELEASE"
  ssh $SSH_OPTS "$SERVER" "mkdir -p $WEBROOT/releases/$RELEASE"
  rsync -az --delete -e "ssh $SSH_OPTS" "$ROOT/apps/$app/dist/" "$SERVER:$WEBROOT/releases/$RELEASE/"
  ssh $SSH_OPTS "$SERVER" "ln -sfn $WEBROOT/releases/$RELEASE $WEBROOT/current"
  echo "→ Оставляем пять последних релизов $app"
  ssh $SSH_OPTS "$SERVER" "cd $WEBROOT/releases && ls -1t | tail -n +6 | xargs -r rm -rf"
done

ssh $SSH_OPTS "$SERVER" "sudo /usr/sbin/nginx -t && sudo /usr/bin/systemctl reload nginx"

echo
echo "Выкачено: $RELEASE (коммит $COMMIT)"
for app in "${APPS[@]}"; do
  u="$(url_for "$app")"
  printf '%-28s %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$u" || echo 'нет ответа')"
done
