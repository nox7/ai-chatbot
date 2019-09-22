const http = require("http");
const app = require("./app");
const socketServer = require("./app-websocket-server");

let httpServer = http.createServer({}, app).listen(3000);
new socketServer(httpServer);
