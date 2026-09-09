#!/usr/bin/env bash
# Удаление связки sniproxy + dnsproxy и бота @mz_dns_alert_bot.
#
# По умолчанию только показывает, что будет удалено. Чтобы выполнить:
#   bash remove-dns-proxy.sh --apply
#
# Телеграм-бота @mz_claude_bot (/opt/telegram-assistant) скрипт не трогает:
# всё, что совпадает с этим именем, исключается на каждом шаге.
set -uo pipefail

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

KEEP='telegram-assistant|mz_claude_bot'
PATTERN='sniproxy|dnsproxy|dns-alert|dns_alert|mz_dns_alert'

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
run() {
  if [ "$APPLY" = 1 ]; then eval "$@"; else echo "    [покажу] $*"; fi
}

say "1. Что нашлось"

echo "  systemd-юниты:"
UNITS=$(systemctl list-unit-files --no-legend 2>/dev/null | awk '{print $1}' \
        | grep -Ei "$PATTERN" | grep -Evi "$KEEP" || true)
echo "${UNITS:-    нет}" | sed 's/^/    /'

echo "  процессы:"
ps -eo pid,pcpu,etime,cmd --no-headers 2>/dev/null | grep -Ei "$PATTERN" \
  | grep -Evi "$KEEP" | grep -v 'grep -E' | sed 's/^/    /' || echo "    нет"

echo "  docker-контейнеры:"
DOCKER_IDS=$(docker ps -aq 2>/dev/null | while read -r c; do
  n=$(docker inspect -f '{{.Name}}' "$c" 2>/dev/null)
  echo "$n" | grep -Eqi "$PATTERN" && ! echo "$n" | grep -Eqi "$KEEP" && echo "$c $n"
done)
echo "${DOCKER_IDS:-    нет}" | sed 's/^/    /'

echo "  каталоги:"
DIRS=$(ls -d /opt/* /etc/sniproxy* /etc/dnsproxy* 2>/dev/null \
       | grep -Ei "$PATTERN" | grep -Evi "$KEEP" || true)
echo "${DIRS:-    нет}" | sed 's/^/    /'

echo "  пакеты:"
PKGS=$(dpkg -l 2>/dev/null | awk '/^ii/{print $2}' | grep -Ei 'sniproxy|dnsproxy' || true)
echo "${PKGS:-    нет}" | sed 's/^/    /'

echo "  задания cron:"
{ crontab -l 2>/dev/null; cat /etc/cron.d/* 2>/dev/null; } \
  | grep -Ei "$PATTERN" | grep -Evi "$KEEP" | sed 's/^/    /' || echo "    нет"

say "2. Разрешение имён"
echo "  сейчас /etc/resolv.conf:"
grep -E '^nameserver' /etc/resolv.conf 2>/dev/null | sed 's/^/    /' || echo "    пусто"
# Если система ходит в DNS через локальный dnsproxy, снос службы оставит
# сервер без разрешения имён. Поэтому публичные серверы прописываем ДО удаления.
if grep -qE '^nameserver\s+(127\.|0\.0\.0\.0)' /etc/resolv.conf 2>/dev/null; then
  echo "  ВНИМАНИЕ: DNS указывает на локальный адрес — переключаю на публичные"
  run "cp /etc/resolv.conf /etc/resolv.conf.bak-\$(date +%F-%H%M%S)"
  run "chattr -i /etc/resolv.conf 2>/dev/null || true"
  run "printf 'nameserver 1.1.1.1\\nnameserver 8.8.8.8\\n' > /etc/resolv.conf"
else
  echo "  локальный резолвер не используется, менять нечего"
fi

say "3. Останавливаем и отключаем службы"
for u in $UNITS; do
  run "systemctl stop '$u'"
  run "systemctl disable '$u'"
done
[ -z "$UNITS" ] && echo "    нечего останавливать"

say "4. Убираем docker-контейнеры"
if [ -n "$DOCKER_IDS" ]; then
  echo "$DOCKER_IDS" | while read -r id name; do
    [ -n "$id" ] || continue
    run "docker rm -f '$id'"
  done
else
  echo "    нечего убирать"
fi

say "5. Удаляем файлы юнитов"
for u in $UNITS; do
  for p in /etc/systemd/system /lib/systemd/system /usr/lib/systemd/system; do
    [ -f "$p/$u" ] && run "rm -f '$p/$u'"
  done
done
run "systemctl daemon-reload"
run "systemctl reset-failed"

say "6. Удаляем пакеты"
if [ -n "$PKGS" ]; then
  run "apt-get purge -y $PKGS"
else
  echo "    из пакетов ничего не ставилось"
fi

say "7. Удаляем каталоги и бинарники"
for d in $DIRS; do run "rm -rf '$d'"; done
for b in /usr/local/bin/dnsproxy /usr/local/bin/sniproxy /usr/bin/dnsproxy /usr/bin/sniproxy; do
  [ -e "$b" ] && run "rm -f '$b'"
done

say "8. Проверка"
if [ "$APPLY" = 1 ]; then
  echo "  осталось процессов:"
  ps -eo pid,cmd --no-headers | grep -Ei "$PATTERN" | grep -Evi "$KEEP" | grep -v 'grep -E' | sed 's/^/    /' || echo "    нет"
  echo "  нагрузка:"; uptime | sed 's/^/    /'
  echo "  бот @mz_claude_bot:"
  systemctl is-active telegram-assistant 2>/dev/null | sed 's/^/    /' || \
    docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep -i telegram | sed 's/^/    /' || echo "    проверьте вручную"
  echo "  разрешение имён:"; getent hosts ya.ru >/dev/null 2>&1 && echo "    работает" || echo "    СЛОМАНО, чините resolv.conf"
else
  echo
  echo "  Это был просмотр. Чтобы выполнить:  bash $0 --apply"
fi
