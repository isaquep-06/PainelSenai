import yup from "yup";
import models from "../models/index.js";

const { Turma, Sala } = models;

class TurmaController {

  // 🔹 Criar turma
  async store(req, res) {
    // Padronizando os turnos (regra de negócio) e validando com yup
    const TURNOS_VALIDOS = ["matutino", "vespertino", "noturno"];

    const schema = yup.object().shape({
      name: yup.string().required("Nome da turma é obrigatório!"),
      turno: yup
        .string()
        .required("Turno é obrigatório!")
        .transform((value) => value?.trim().toLowerCase())
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

    try {
      // normalização simples (evita inconsistência)
      const turnoNormalizado = turno.trim().toLowerCase();

      // evita duplicidade de nome (regra de negócio)
      const turmaExistente = await Turma.findOne({
        where: { name }
      });

      if (turmaExistente) {
        return res.status(400).json({
          message: "Já existe uma turma com esse nome!"
        });
      }

      // valida sala existe (se informada)
      if (sala_id) {
        const sala = await Sala.findByPk(sala_id);

        if (!sala) {
          return res.status(400).json({
            message: "Sala não existe!"
          });
        }
      }

      // CRIAÇÃO (regra de conflito é do BANCO)
      const turma = await Turma.create({
        name,
        turno: turnoNormalizado,
        sala_id: sala_id || null,
      });

      const turmaCompleta = await Turma.findByPk(turma.id, {
        include: [{
          model: Sala,
          as: "Sala",
          attributes: ["id", "name"]
        }]
      });

      return res.status(201).json({
        message: "Turma criada com sucesso!",
        turma: turmaCompleta
      });

    } catch (err) {
      console.error("🔥 ERRO:", err);

      // tratamento correto do UNIQUE (sala_id + turno)
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: "Essa sala já está ocupada nesse turno!"
        });
      }

      return res.status(500).json({
        message: "Erro interno ao criar turma"
      });
    }
  }

  // 🔹 Atualizar turma
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      turno: yup.string(),
      sala_id: yup.number().nullable()
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
          message: "Turma não existe!"
        });
      }

      // valida nome duplicado
      if (name) {
        const nomeExistente = await Turma.findOne({
          where: { name }
        });

        if (nomeExistente && nomeExistente.id !== Number(id)) {
          return res.status(400).json({
            message: "Já existe uma turma com esse nome!"
          });
        }
      }

      const turnoFinal = turno
        ? turno.trim().toLowerCase()
        : turma.turno;

      await turma.update({
        name: name ?? turma.name,
        turno: turnoFinal,
        sala_id: sala_id ?? turma.sala_id
      });

      return res.status(200).json({
        message: "Turma atualizada com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao atualizar turma:", err);

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: "Essa sala já está ocupada nesse turno!"
        });
      }

      return res.status(500).json({
        message: "Erro interno ao atualizar turma"
      });
    }
  }

  // 🔷 Deletar turma
  async delete(req, res) {
    const { id } = req.params;

    try {
      const turma = await Turma.findByPk(id);

      if (!turma) {
        return res.status(404).json({
          message: "Turma não encontrada!"
        });
      }

      await turma.destroy();

      return res.status(200).json({
        message: "Turma deletada com sucesso!"
      });

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erro interno ao deletar turma"
      });
    }
  }

  // 🔹 Listar turmas
  async index(req, res) {
    try {
      const { turno } = req.query;

      const turmas = await Turma.findAll({
        where: turno ? { turno } : {},
        include: [{
          model: Sala,
          as: "Sala",
          attributes: ["id", "name"]
        }],
        order: [["sala_id", "ASC"]]
      });

      return res.status(200).json(turmas);

    } catch (err) {
      console.error("Erro ao buscar turmas:", err);

      return res.status(500).json({
        message: "Erro interno ao buscar turmas"
      });
    }
  }
}

export default new TurmaController();