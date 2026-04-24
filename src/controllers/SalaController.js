import yup from "yup";
import models from "../models/index.js";
import { io } from "../server.js";

const { Sala, Turma } = models;

class SalaController {

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      type: yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ message: err.errors });
    }

    const { name, type } = req.body;
    const nameDefault = name.trim().toLowerCase();

    try {
      const existingSala = await Sala.findOne({
        where: { name: nameDefault }
      });

      if (existingSala) {
        return res.status(409).json({ message: "Sala já existe!" });
      }

      const sala = await Sala.create({
        name: nameDefault,
        type,
      });

      io.emit("dashboard:update", {
        type: "SALA_CREATED"
        
      });

      return res.status(201).json({
        message: "Sala criada com sucesso!",
        sala,
      });

    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Sala já existe!" });
      }

      console.error("Erro ao criar sala:", err);
      return res.status(500).json({
        message: "Erro interno ao criar sala"
      });
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      type: yup.string(),
    });

    try {
      schema.validateSync(req.body, {
        abortEarly: false,
        strict: true,
      });
    } catch (err) {
      return res.status(400).json({ message: err.errors });
    }

    const { name, type } = req.body;
    const { id } = req.params;

    try {
      const sala = await Sala.findByPk(id);

      if (!sala) {
        return res.status(404).json({
          message: "Sala não existe!"
        });
      }

      const updatedName = name
        ? name.trim().toLowerCase()
        : sala.name;

      if (name) {
        const existing = await Sala.findOne({
          where: { name: updatedName }
        });

        if (existing && existing.id !== Number(id)) {
          return res.status(409).json({
            message: "Já existe uma sala com esse nome!"
          });
        }
      }

      await sala.update({
        name: updatedName,
        type: type ?? sala.type,
      });

      io.emit("dashboard:update", {
        type: "SALA_UPDATED"
      });

      return res.status(200).json({
        message: "Sala atualizada com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao atualizar sala:", err);

      return res.status(500).json({
        message: "Erro interno ao atualizar sala"
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const sala = await Sala.findByPk(id);

      if (!sala) {
        return res.status(404).json({
          message: "Sala não encontrada!"
        });
      }

      await sala.destroy();

      io.emit("dashboard:update", {
        type: "SALA_DELETED"
      });

      return res.status(200).json({
        message: "Sala deletada com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao deletar sala:", err);

      return res.status(500).json({
        message: "Erro interno ao deletar sala"
      });
    }
  }

  async index(req, res) {
    try {
      const salas = await Sala.findAll({
        include: ["Turmas"],
      });

      return res.status(200).json(salas);

    } catch (err) {
      console.error("Erro ao buscar salas:", err);

      return res.status(500).json({
        message: "Erro interno ao buscar salas"
      });
    }
  }

  async disponiveis(req, res) {
    const { turno } = req.query;

    try {
      const salas = await Sala.findAll({
        include: {
          model: Turma,
          as: "Turmas",
          required: false,
          where: turno ? { turno } : undefined,
        },
      });

      const salasDisponiveis = salas.filter((sala) => {
        return sala.Turmas.length === 0;
      });

      return res.status(200).json(salasDisponiveis);

    } catch (err) {
      console.error("Erro ao buscar salas disponíveis:", err);

      return res.status(500).json({
        message: "Erro ao buscar salas disponíveis"
      });
    }
  }
}

export default new SalaController();