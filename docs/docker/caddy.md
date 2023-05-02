docker stop caddy
docker rm caddy
docker run -d --name='caddy' \
--net='host' \
-v '/root':'/data':'rw' \
-v '/root/caddy':'/config':'rw' \
-v '/root/caddy/Caddyfile':'/etc/caddy/Caddyfile':'rw' \
caddy

```
etsy.react.mobi {
    handle_path /api* {
        reverse_proxy localhost:3101
    }
    handle {
        root * /data/etsyweb/dist
        file_server
    }
}

etsyapi.react.mobi {
    reverse_proxy localhost:3101
}
```
