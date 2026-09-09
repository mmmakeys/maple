#!/usr/bin/env bash
# Разовая подготовка сервера Timeweb под два сайта.
# Запускать на сервере от root. Скрипт ничего не ломает молча: если порты
# 80/443 уже заняты чужим процессом — останавливается и показывает, кем.
set -euo pipefail

SERVER_IP="186.246.6.76"
WEBROOTS=("/var/www/maple" "/var/www/scenika")
EMAIL="${CERTBOT_EMAIL:-maximzotov93@gmail.com}"

echo "→ Что уже слушает 80 и 443"
ss -tlnp 2>/dev/null | awk 'NR==1 || /:80 |:443 /' || true

BUSY=$(ss -tlnp 2>/dev/null | awk '/:80 |:443 /' | grep -v nginx || true)
if [ -n "$BUSY" ]; then
  echo
  echo "ОСТАНОВЛЕНО: порты 80/443 держит не nginx." >&2
  echo "$BUSY" >&2
  echo "На этом сервере работает телеграм-бот; разберитесь с конфликтом вручную." >&2
  exit 1
fi

echo "→ Ставим nginx и certbot"
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx rsync

echo "→ Каталоги"
# current — это симлинк на активный релиз, каталогом его создавать нельзя.
# Владелец каталога остаётся deploy, иначе выкатка перестанет писать туда;
# www-data достаточно группы и права на чтение.
mkdir -p /var/www/certbot
chown -R deploy:www-data /var/www/certbot
for w in "${WEBROOTS[@]}"; do
  mkdir -p "$w/releases"
  chown -R deploy:www-data "$w"
  chmod 755 "$w"
done

echo "→ Конфиги nginx"
# До выпуска сертификатов включаем только http-часть, иначе nginx
# не стартует из-за отсутствующих файлов сертификата.
for d in maple-media.ru scenika.ru; do
  install -m 644 "/tmp/nginx/$d.conf" "/etc/nginx/sites-available/$d.conf"
  ln -sf "/etc/nginx/sites-available/$d.conf" "/etc/nginx/sites-enabled/$d.conf"
done
rm -f /etc/nginx/sites-enabled/default

echo "→ Пока только http: сертификатов ещё нет, с ними nginx не стартует"
for d in maple-media.ru scenika.ru; do
  awk '/^server \{/{n++} n==1' "/etc/nginx/sites-available/$d.conf" > "/etc/nginx/sites-available/$d.http.conf"
  ln -sf "/etc/nginx/sites-available/$d.http.conf" "/etc/nginx/sites-enabled/$d.conf"
done
nginx -t && systemctl reload nginx

echo
echo "Готово. nginx поднят, сайты отдаются по http."
echo "Дальше: обновить A-записи на этот сервер, затем запустить issue-certs.sh."
