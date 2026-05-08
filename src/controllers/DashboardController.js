import models from "../models/index.js";
import ordenarSalas from "../Middleware/ordenarSala.js";
import { Op } from "sequelize";
import { getLatestSystemUpdate } from "../services/systemUpdateLogService.js";

const { Turma, Sala } = models;

class DashboardController {
  async index(req, res) {
    try {
      const { turno } = req.query;

      const validTurnos = ["matutino", "vespertino", "noturno"];

      const where = {};

      if (turno) {
        if (!validTurnos.includes(turno)) {
          return res.status(400).json({ message: "Turno invÃ¡lido" });
        }

        where.turno = turno;
      }

      where.sala_id = {
        [Op.ne]: null
      };

      const turma = await Turma.findAll({
        where,
        include: [
          {
            model: Sala,
            as: "Sala",
            attributes: ["name"]
          }
        ],
        attributes: ["id", "name", "turno"]
      });

      const response = turma.map((t) => ({
        id: t.id,
        turma: t.name,
        sala: t.Sala?.name,
        turno: t.turno
      }));

      const ordenado = ordenarSalas(response);

      return res.status(200).json(ordenado);

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao buscar dashboard"
      });
    }
  }

  async latestUpdate(req, res) {
    try {
      const latestUpdate = await getLatestSystemUpdate();

      if (!latestUpdate) {
        return res.status(200).json({
          message: "Nenhuma atualização registrada até o momento.",
          last_update: null,
        });
      }

      return res.status(200).json({
        last_update: latestUpdate,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao buscar a última atualização",
      });
    }
  }
}

export default new DashboardController();
