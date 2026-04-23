import yup from "yup";
import models from "../models/index.js";
import { io } from "../server.js";

const { Turma, Sala } = models;

const TURNOS_VALIDOS = ["matutino", "vespertino", "noturno"];

class TurmaController {

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required("Nome da turma é obrigatório!"),
      turno: yup
        .string()
        .required("Turno é obrigatório!")
        .transform((v) => v?.trim().toLowerCase())
        .oneOf(TURNOS_VALIDOS, "Turno inválido!"),
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
          message: "Já existe uma turma com esse nome!",
        });
      }

      if (sala_id) {
        const sala = await Sala.findByPk(sala_id);
        if (!sala) {
          return res.status(400).json({
            message: "Sala não existe!",
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
          message: "Essa sala já está ocupada nesse turno!",
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
        .oneOf(TURNOS_VALIDOS, "Turno inválido!")
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
          message: "Turma não existe!",
        });
      }

      // 🔹 valida nome duplicado
      if (name) {
        const nomeExistente = await Turma.findOne({ where: { name } });

        if (nomeExistente && nomeExistente.id !== Number(id)) {
          return res.status(400).json({
            message: "Já existe uma turma com esse nome!",
          });
        }
      }

      // 🔹 valida sala (só se não for undefined)
      if (sala_id !== undefined && sala_id !== null) {
        const sala = await Sala.findByPk(sala_id);

        if (!sala) {
          return res.status(400).json({
            message: "Sala não existe!",
          });
        }
      }

      // 🔥 monta update seguro
      const updatedData = {
        name: name ?? turma.name,
        turno: turno ?? turma.turno,
      };

      // 🔥 REGRA IMPORTANTE:
      // null = remove sala
      // undefined = mantém atual
      if (sala_id === undefined) {
        updatedData.sala_id = turma.sala_id;
      } else {
        updatedData.sala_id = sala_id;
      }

      await turma.update(updatedData);

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
          message: "Conflito de dados (turma/sala já existe)!",
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
          message: "Turma não encontrada!",
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