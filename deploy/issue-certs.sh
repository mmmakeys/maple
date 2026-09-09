#!/usr/bin/env bash
# Выпуск сертификатов и включение https. Запускать от root ПОСЛЕ того,
# как A-записи доменов начали указывать на этот сервер: Let's Encrypt
# проверяет владение доменом, обращаясь к нему по имени.
set -euo pipefail

EMAIL="${CERTBOT_EMAIL:-maximzotov93@gmail.com}"
DOMAINS=("$@")
[ ${#DOMAINS[@]} -gt 0 ] || DOMAINS=(scenika.ru www.scenika.ru)

MY_IP=$(curl -s --max-time 10 https://api.ipify.org || echo '')
echo "→ Адрес сервера: ${MY_IP:-неизвестен}"
for d in "${DOMAINS[@]}"; do
  # спрашиваем публичный резолвер, а не системный: у вышестоящего DNS
  # сервера может висеть старая запись, а Let's Encrypt всё равно пойдёт
  # к авторитетным серверам домена и увидит актуальную
  resolved=$(dig +short A "$d" @1.1.1.1 2>/dev/null | tail -1)
  [ -n "$resolved" ] || resolved=$(getent hosts "$d" | awk '{print $1}' | head -1)
  printf '  %-22s → %s\n' "$d" "${resolved:-не резолвится}"
  if [ -n "$MY_IP" ] && [ "$resolved" != "$MY_IP" ]; then
    echo "ОСТАНОВЛЕНО: $d указывает не на этот сервер, проверка не пройдёт." >&2
    echo "Дождитесь обновления DNS и запустите скрипт снова." >&2
    exit 1
  fi
done

ARGS=(); for d in "${DOMAINS[@]}"; do ARGS+=(-d "$d"); done

echo "→ Запрашиваем сертификат"
certbot certonly --webroot -w /var/www/certbot "${ARGS[@]}" \
  --email "$EMAIL" --agree-tos --non-interactive --expand

echo "→ Включаем полные конфиги с https"
for d in maple-media.ru scenika.ru; do
  avail="/etc/nginx/sites-available/$d.conf"
  # включаем только те, для которых сертификат уже есть
  cert_dir=$(awk '/ssl_certificate /{print $2; exit}' "$avail" 2>/dev/null | xargs dirname 2>/dev/null || true)
  if [ -n "$cert_dir" ] && [ -d "$cert_dir" ]; then
    rm -f "/etc/nginx/sites-available/$d.http.conf"
    ln -sf "$avail" "/etc/nginx/sites-enabled/$d.conf"
    echo "  $d — https включён"
  else
    echo "  $d — сертификата нет, остаётся на http"
  fi
done

nginx -t && systemctl reload nginx
systemctl enable --now certbot.timer
echo
echo "Готово. Автопродление включено."
