podman machine start

alias docker=podman

echo '>>> start mongo'
docker start mongo

echo '>>> start redis'
docker start redis

# npm run dev


# podman run -it -v `pwd`:/workspace -w /workspace --privileged=true node:12 yarn
# podman start node -itd -v `pwd`:/workspace -w /workspace -p 3101:3101 --privileged=true node:12 yarn start
