#!/usr/bin/env bash
# Разовая настройка учётной записи под выкатку. Запускать на сервере от root.
# Создаёт пользователя deploy, который владеет только каталогом сайта
# и умеет перезагружать nginx — трогать телеграм-бота ему нечем.
set -euo pipefail

PUBKEY='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICI4MnsRI5VtT+X+Xf95oQ7bd9vgpVTR6X+EpwOPvmqv maple-deploy@MacBook-Pro-2'
USER_NAME="deploy"
WEBROOTS=("/var/www/maple" "/var/www/scenika")

id -u "$USER_NAME" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$USER_NAME"

install -d -m 700 -o "$USER_NAME" -g "$USER_NAME" "/home/$USER_NAME/.ssh"
grep -qF "$PUBKEY" "/home/$USER_NAME/.ssh/authorized_keys" 2>/dev/null || \
  echo "$PUBKEY" >> "/home/$USER_NAME/.ssh/authorized_keys"
chmod 600 "/home/$USER_NAME/.ssh/authorized_keys"
chown "$USER_NAME:$USER_NAME" "/home/$USER_NAME/.ssh/authorized_keys"

# Сайтов два, каталога тоже два. Владельцем остаётся deploy: симлинк
# current создаётся внутри корня, и без прав на сам корень выкатка падает
# уже после того, как первый сайт переключён.
for w in "${WEBROOTS[@]}"; do
  mkdir -p "$w/releases"
  chown -R "$USER_NAME:www-data" "$w"
  chmod 755 "$w"
done

# сюда certbot кладёт файлы для проверки домена, каталог общий на оба сайта
install -d -m 755 -o "$USER_NAME" -g www-data /var/www/certbot

# sudo строго на две команды: проверить конфиг и перезагрузить nginx
cat > /etc/sudoers.d/deploy-nginx <<'SUDO'
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx, /bin/systemctl reload nginx
SUDO
chmod 440 /etc/sudoers.d/deploy-nginx
visudo -c -f /etc/sudoers.d/deploy-nginx

echo "Готово: пользователь $USER_NAME, каталоги ${WEBROOTS[*]}, sudo только на nginx -t и reload."
