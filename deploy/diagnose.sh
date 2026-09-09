#!/usr/bin/env bash
# Что съедает процессор. Запускать сразу после перезагрузки, пока сервер
# отвечает: нагрузка нарастает не мгновенно, окно обычно есть.
echo "=== аптайм и средняя нагрузка ==="
uptime

echo; echo "=== топ по процессору ==="
ps -eo pid,ppid,user,pcpu,pmem,etime,cmd --sort=-pcpu | head -12

echo; echo "=== топ по памяти ==="
ps -eo pid,user,pmem,rss,cmd --sort=-pmem | head -6

echo; echo "=== память и подкачка ==="
free -h

echo; echo "=== диск ==="
df -h / /var 2>/dev/null | grep -v tmpfs

echo; echo "=== docker ==="
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.RunningFor}}' 2>/dev/null | head -10
echo "--- перезапуски контейнеров ---"
for c in $(docker ps -aq 2>/dev/null); do
  printf '%-24s restarts=%s\n' "$(docker inspect -f '{{.Name}}' "$c" 2>/dev/null)" \
    "$(docker inspect -f '{{.RestartCount}}' "$c" 2>/dev/null)"
done

echo; echo "=== упавшие юниты systemd ==="
systemctl --failed --no-pager | head -10

echo; echo "=== последние ошибки ядра (OOM, паники) ==="
dmesg -T 2>/dev/null | grep -iE 'oom|killed process|out of memory' | tail -8 || echo "нет"

echo; echo "=== логи за час с ошибками ==="
journalctl --since '1 hour ago' -p err --no-pager 2>/dev/null | tail -15

echo; echo "=== задачи cron ==="
crontab -l 2>/dev/null | grep -v '^#' | head
ls -1 /etc/cron.d/ 2>/dev/null | head

echo; echo "=== кто заходил по ssh ==="
last -n 8 2>/dev/null | head -8
