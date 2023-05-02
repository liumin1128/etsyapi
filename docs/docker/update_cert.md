
acme.sh --issue --dns dns_ali -d react.mobi -d *.react.mobi

acme.sh --install-cert -d react.mobi --key-file /etc/nginx/ssl/key.pem --fullchain-file /etc/nginx/ssl/cert.pem

podman stop mynginx
podman rm mynginx  
podman run \
--name mynginx \
--privileged=true \
-v /root:/root \
-v /etc/nginx:/etc/nginx \
-p 80:80 \
-p 443:443 \
-d nginx
podman logs mynginx  