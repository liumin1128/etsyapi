echo "run nginx"

docker run --name nginx -p 8080:80 -v /root/nginx/log:/var/log/nginx -v /root/nginx/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/conf.d:/etc/nginx/conf.d -d nginx
