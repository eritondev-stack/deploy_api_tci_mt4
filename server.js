"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _morgan = require('morgan'); var _morgan2 = _interopRequireDefault(_morgan);
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _http = require('http'); var _http2 = _interopRequireDefault(_http);






const app = _express2.default.call(void 0, );
const server = _http2.default.createServer(app) 

// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transport: ["websocket"]
      }
})

global.SocketServer = io

// eslint-disable-next-line @typescript-eslint/no-unused-vars
io.on('connection', (socket) => console.log('Alguém connectou'))
app.use(_morgan2.default.call(void 0, "dev"));
app.use(_cors2.default.call(void 0, ));
app.use(_express2.default.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }))
app.use(_express2.default.json({ limit: "50mb" }));
app.use(_routes2.default);

app.use("/uploads", _express2.default.static(_path2.default.resolve(__dirname, "..", "uploads")));

server.listen(process.env.PORT || 5000);
