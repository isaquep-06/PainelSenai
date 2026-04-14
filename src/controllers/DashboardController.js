import models from "../models/index.js";

const { Turma, Sala } = models;

class DashboardController {
  async index(req, res) {
    try {
      const { turno } = req.query;

      const validTurnos = ["matutino", "vespertino", "noturno"];

      const where = {};

      if (turno) {
        if (!validTurnos.includes(turno)) {
          return res.status(400).json({
            message: "Turno inválido"
          });
        }

        where.turno = turno;
      }

      const turma = await Turma.findAll({
        where,
        include: [{
          model: Sala,
          as: "Sala",
          attributes: ["name"]
        }],
        attributes: ["name", "turno"]
      });

      const response = turma.map(t => ({
        id: t.id,
        turma: t.name,
        sala: t.Sala?.name || "SEM SALA",
        turno: t.turno
      }));

      return res.status(200).json(response);

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao buscar dashboard"
      });
    }
  }
}

export default new DashboardController();