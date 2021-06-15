# StickerBox Server

The server-side project for [StickerBox](https://github.com/tom6311tom6311/midterm_sticker_box)

Please follow these steps to deploy server

1. Make sure you have Node (`^10.15.3`) and NPM (`^6.9.0`) installed
2. `sudo npm i -g forever` --> a tool for running node server permanently
3. Clone [this](https://github.com/tom6311tom6311/sticker_box_server.git) project to your server
4. `cd sticker_box_server`
5. `yarn`
6. `cd data/models/`
7. `tar -zxvf zh.vec.tar.gz`
8. `cd ../..`
9. Make sure no other process is occupying port 5000 and TCP traffic is allowed to pass through the port.
10. `forever start -c "node -r babel-register" index.js`
11. Now you are ready to build client side app. Check [this](https://github.com/tom6311tom6311/midterm_sticker_box) project.
