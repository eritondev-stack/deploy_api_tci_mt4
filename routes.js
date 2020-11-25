"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _PointsConrollers = require('./controllers/PointsConrollers'); var _PointsConrollers2 = _interopRequireDefault(_PointsConrollers);
var _ItemsControllers = require('./controllers/ItemsControllers'); var _ItemsControllers2 = _interopRequireDefault(_ItemsControllers);
var _TradesControllers = require('./controllers/TradesControllers'); var _TradesControllers2 = _interopRequireDefault(_TradesControllers);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

const routes = _express2.default.Router();
const upload = _multer2.default.call(void 0, _multer4.default);
const pointController = new (0, _PointsConrollers2.default)();
const itemsController = new (0, _ItemsControllers2.default)();
const tradesController = new (0, _TradesControllers2.default)();

routes.post('/trades/:account', tradesController.trades)
routes.post('/history/:account', tradesController.histoty)
routes.post('/account/:accountt', tradesController.acoount)
routes.get('/targetday', tradesController.targetForDay)

routes.get("/items", itemsController.index);
routes.post("/items/upload", upload.single("arquivo"), itemsController.upload)
''
routes.get("/points", pointController.index);
routes.post("/points", pointController.create);
routes.get("/points/:id", pointController.show);

exports. default = routes;
