"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _knex = require('knex'); var _knex2 = _interopRequireDefault(_knex);

const connection = _knex2.default.call(void 0, {
  client: "mysql",
  connection: {
    user: "user_dev",
    password: "E21071993",
    host: 'mysql741.umbler.com',
    database: "tci-database",
    port: 41890
  },
});

exports. default = connection;
