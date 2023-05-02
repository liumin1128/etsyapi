echo '>>> start mongo'
podman start mongo

echo '>>> start redis'
podman start redis

#npm run dev


# podman run -it -v `pwd`:/workspace -w /workspace --privileged=true node:12 yarn
# podman start node -itd -v `pwd`:/workspace -w /workspace -p 3101:3101 --privileged=true node:12 yarn start
