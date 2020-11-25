"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);

exports. default = {
    storage: _multer2.default.diskStorage({
        destination: _path2.default.resolve(__dirname, "..", "..", "uploads"),
         filename(request, file, callback){
          const hash = _crypto2.default.randomBytes(6).toString("hex");
          const filename = `${hash}-${file.originalname}`;
          callback(null, filename);
         }
    })
}

