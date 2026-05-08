import yup from "yup";
import models from "../models/index.js";
import { io } from "../server.js";
import { registerSystemUpdate } from "../services/systemUpdateLogService.js";

const { Turma, Sala } = models;

const TURNOS_VALIDOS = ["matutino", "vespertino", "noturno"];

class TurmaController {

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required("Nome da turma Ã© obrigatÃ³rio!"),
      turno: yup
        .string()
        .required("Turno Ã© obrigatÃ³rio!")
        .transform((v) => v?.trim().toLowerCase())
        .oneOf(TURNOS_VALIDOS, "Turno invÃ¡lido!"),
      sala_id: yup.number().nullable(),
    });

    try {
      await schema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });
    } catch (err) {
      return res.status(400).json({ message: err.errors });
    }

    const { name, turno, sala_id } = req.body;
    const turnoNormalizado = turno.trim().toLowerCase();

    try {
      const turmaExistente = await Turma.findOne({ where: { name } });

      if (turmaExistente) {
        return res.status(400).json({
          message: "JÃ¡ existe uma turma com esse nome!",
        });
      }

      if (sala_id) {
        const sala = await Sala.findByPk(sala_id);
        if (!sala) {
          return res.status(400).json({
            message: "Sala nÃ£o existe!",
          });
        }
      }

      const turma = await Turma.create({
        name,
        turno: turnoNormalizado,
        sala_id: sala_id || null,
      });

      const turmaCompleta = await Turma.findByPk(turma.id, {
        include: [{
          model: Sala,
          as: "Sala",
          attributes: ["id", "name"],
        }],
      });

      io.emit("dashboard:update", {
        type: "TURMA_CREATED",
        turno: turnoNormalizado,
        timestamp: Date.now()
      });

      return res.status(201).json({
        message: "Turma criada com sucesso!",
        turma: turmaCompleta,
      });

    } catch (err) {
      console.error(err);

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: "Essa sala jÃ¡ estÃ¡ ocupada nesse turno!",
        });
      }

      return res.status(500).json({
        message: "Erro interno ao criar turma",
      });
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      turno: yup
        .string()
        .transform((v) => v?.trim().toLowerCase())
        .oneOf(TURNOS_VALIDOS, "Turno invÃ¡lido!")
        .notRequired(),
      sala_id: yup.number().nullable(),
    });

    try {
      await schema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });
    } catch (err) {
      return res.status(400).json({ message: err.errors });
    }

    const { name, turno, sala_id } = req.body;
    const { id } = req.params;

    try {
      const turma = await Turma.findByPk(id);

      if (!turma) {
        return res.status(404).json({
          message: "Turma nÃ£o existe!",
        });
      }

      if (name) {
        const nomeExistente = await Turma.findOne({ where: { name } });

        if (nomeExistente && nomeExistente.id !== Number(id)) {
          return res.status(400).json({
            message: "JÃ¡ existe uma turma com esse nome!",
          });
        }
      }

      if (sala_id !== undefined && sala_id !== null) {
        const sala = await Sala.findByPk(sala_id);

        if (!sala) {
          return res.status(400).json({
            message: "Sala nÃ£o existe!",
          });
        }
      }

      const updatedData = {
        name: name ?? turma.name,
        turno: turno ?? turma.turno,
      };

      // `null` remove a sala; `undefined` preserva o valor atual.
      if (sala_id === undefined) {
        updatedData.sala_id = turma.sala_id;
      } else {
        updatedData.sala_id = sala_id;
      }

      await turma.update(updatedData);

      await registerSystemUpdate({
        entityType: "turma",
        entityId: turma.id,
        action: "updated",
        turno: updatedData.turno,
        turnos: updatedData.turno ? [updatedData.turno] : [],
        userId: req.userId,
      });

      io.emit("dashboard:update", {
        type: "TURMA_UPDATED",
        turno: updatedData.turno,
        timestamp: Date.now(),
      });

      return res.status(200).json({
        message: "Turma atualizada com sucesso!",
      });

    } catch (err) {
      console.error(err);

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: "Conflito de dados (turma/sala jÃ¡ existe)!",
        });
      }

      return res.status(500).json({
        message: "Erro interno ao atualizar turma",
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const turma = await Turma.findByPk(id);

      if (!turma) {
        return res.status(404).json({
          message: "Turma nÃ£o encontrada!",
        });
      }

      const turno = turma.turno;

      await turma.destroy();

      io.emit("dashboard:update", {
        type: "TURMA_DELETED",
        turno,
        timestamp: Date.now()
      });

      return res.status(200).json({
        message: "Turma deletada com sucesso!",
      });

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao deletar turma",
      });
    }
  }

  async index(req, res) {
    try {
      const { turno } = req.query;

      const where = turno ? { turno } : {};

      const turmas = await Turma.findAll({
        where,
        include: [{
          model: Sala,
          as: "Sala",
          attributes: ["id", "name"],
        }],
        order: [["sala_id", "ASC"]],
      });

      return res.status(200).json(turmas);

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao buscar turmas",
      });
    }
  }
}

export default new TurmaController();
