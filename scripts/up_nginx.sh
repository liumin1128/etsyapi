rsync -r ./nginx/* root@47.94.132.105:/root/nginx

ssh root@47.94.132.105 "
echo '>>> restart nginx container'
docker restart nginx
"

# ssh root@47.94.132.105 "
# echo '>>> init nginx'
# docker stop nginx
# docker rm nginx

# docker run \
# -v /root/nginx/ssl:/etc/nginx/ssl \
# -v /root/nginx/log:/var/log/nginx \
# -v /root/nginx/nginx.conf:/etc/nginx/nginx.conf \
# -v /root/nginx/conf.d:/etc/nginx/conf.d \
# -p 80:80 \
# -p 443:443 \
# --name nginx \
# -d nginx

# docker ps

# docker logs nginx

# "