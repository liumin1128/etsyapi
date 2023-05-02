### 加速

https://www.daocloud.io/mirror#accelerator-doc

"registry-mirrors":["https://registry.docker-cn.com","http://f1361db2.m.daocloud.io"]

### 查看本地镜像

docker images

### 查看运行容器
docker ps

### 查看所有容器
docker ps -a

### 进入容器
其中字符串为容器ID:
docker exec -it d27bd3008ad9 /bin/bash

### 停用全部运行中的容器:
docker stop $(docker ps -q)

### 删除全部容器：
docker rm $(docker ps -aq)

### 一条命令实现停用并删除容器：
docker stop $(docker ps -q) & docker rm $(docker ps -aq)
