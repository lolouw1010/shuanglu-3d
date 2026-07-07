#!/usr/bin/env bash
set -euo pipefail

domain="shuanglu.uway.click"
live_dir="/etc/letsencrypt/live/${domain}"
cert_dir="/home/web/certs"
cert_target="${cert_dir}/${domain}_cert.pem"
key_target="${cert_dir}/${domain}_key.pem"

install -d -m 755 "${cert_dir}"
install -m 644 "${live_dir}/fullchain.pem" "${cert_target}.new"
install -m 600 "${live_dir}/privkey.pem" "${key_target}.new"

openssl x509 -in "${cert_target}.new" -noout -checkend 86400

cp -p "${cert_target}" "${cert_target}.previous"
cp -p "${key_target}" "${key_target}.previous"

mv -f "${cert_target}.new" "${cert_target}"
mv -f "${key_target}.new" "${key_target}"

if ! docker exec nginx nginx -t; then
  mv -f "${cert_target}.previous" "${cert_target}"
  mv -f "${key_target}.previous" "${key_target}"
  docker exec nginx nginx -t
  exit 1
fi

docker exec nginx nginx -s reload
rm -f "${cert_target}.previous" "${key_target}.previous"
