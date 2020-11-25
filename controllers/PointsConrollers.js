"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _connection = require('../database/connection'); var _connection2 = _interopRequireDefault(_connection);

// Coment
class PointsController {
  async index(req, res) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    try {
      const points = await _connection2.default.call(void 0, "tb_points")
        .join(
          "tb_points_items",
          "tb_points.id",
          "=",
          "tb_points_items.point_id"
        )
        .whereIn("tb_points_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("tb_points.*");
      return res.status(200).send(points);
    } catch (error) {
      return res.status(401).send(error);
    }
  }

  async create(req, res) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await _connection2.default.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    try {
      const insertedIds = await trx("tb_points").insert(point);

      const point_id = insertedIds[0];

      const pointItems = items.map((item_id) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx("tb_points_items").insert(pointItems);

      trx.commit();

      return res.status(200).json({
        id: point_id,
        ...point,
      });
    } catch (error) {
      return res.status(501).json(error);
    }
  }

  async show(req, res) {
    const { id } = req.params;
    const point = await _connection2.default.call(void 0, "tb_points").where("id", id).first();
    if (!point) {
      return res.status(400).json({
        message: "Point not found",
      });
    }

    const items = await _connection2.default.call(void 0, "tb_items")
      .join("tb_points_items", "tb_items.id", "=", "tb_points_items.item_id")
      .where("tb_points_items.point_id", id)
      .select("tb_items.title", "tb_items.id");
    return res.status(200).json({ point, items });
  }
}

exports. default = PointsController;
