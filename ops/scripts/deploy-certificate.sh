#!/usr/bin/env bash
set -euo pipefail

domain="3d.shuanglu.uway.click"
live_dir="/etc/letsencrypt/live/${domain}"
cert_dir="/home/web/certs"
cert_target="${cert_dir}/${domain}_cert.pem"
key_target="${cert_dir}/${domain}_key.pem"

install -d -m 755 "${cert_dir}"
install -m 644 "${live_dir}/fullchain.pem" "${cert_target}.new"
install -m 600 "${live_dir}/privkey.pem" "${key_target}.new"
openssl x509 -in "${cert_target}.new" -noout -checkend 86400

had_previous=false
if [[ -f "${cert_target}" && -f "${key_target}" ]]; then
  cp -p "${cert_target}" "${cert_target}.previous"
  cp -p "${key_target}" "${key_target}.previous"
  had_previous=true
fi

mv -f "${cert_target}.new" "${cert_target}"
mv -f "${key_target}.new" "${key_target}"

if ! docker exec nginx nginx -t; then
  if [[ "${had_previous}" == "true" ]]; then
    mv -f "${cert_target}.previous" "${cert_target}"
    mv -f "${key_target}.previous" "${key_target}"
  else
    rm -f "${cert_target}" "${key_target}"
  fi
  exit 1
fi

docker exec nginx nginx -s reload
rm -f "${cert_target}.previous" "${key_target}.previous"
