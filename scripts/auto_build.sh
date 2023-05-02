ssh root@8.131.92.84 '
cd ~/api.react.mobi
git pull --rebase
yarn
yarn build
yarn pm2
'
