"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _connection = require('../database/connection'); var _connection2 = _interopRequireDefault(_connection);









class ItemsController {
  
  //Consulta 
  async index(req, res) {
    try {
      const items = await _connection2.default.call(void 0, "VW_CAPACITY").select("*");
      console.log(items)
      const serializedItems = items.map((item) => {
        return {
          mes: item.MES,
          contrato: item.CONTRATO   
        };
      });
      return res.status(200).json(serializedItems);
    } catch (error) {
      return res.status(200).json({ error: error });
    }
  }


  //Create
  async upload(req, res) {
  

    const point = {
      arquivo: "http://localhost:3333/uploads/" + req.file.filename,
      name: req.body.nome,
    };

    console.log(point)

    try {
      //const insertedIds = await knex("tb_points").insert(point);
      return res.status(200).json({
        dados: point
      });
    } catch (error) {
      return res.status(501).json(error);
    }
  }

  

 





}

exports. default = ItemsController;
