import models from "../models/index.js";
import ordenarSalas from "../Middleware/ordenarSala.js";
import { Op } from "sequelize";

const { Turma, Sala } = models;

class DashboardController {
  async index(req, res) {
    try {
      const { turno } = req.query;

      const validTurnos = ["matutino", "vespertino", "noturno"];

      const where = {};

      // 🔹 filtro de turno
      if (turno) {
        if (!validTurnos.includes(turno)) {
          return res.status(400).json({ message: "Turno inválido" });
        }

        where.turno = turno;
      }

      // 🔥 REMOVE TURMAS SEM SALA
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
}

export default new DashboardController();