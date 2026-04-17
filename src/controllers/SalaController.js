import yup from 'yup';
import models from '../models/index.js';
import { Op } from 'sequelize';

const { Sala, Turma } = models;

class SalaController {

  // Criar sala 🔷 (ESPAÇOS DE AULA) -> POST
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
      const existingSala = await Sala.findOne({ where: { name: nameDefault } });

      if (existingSala) {
        return res.status(409).json({ message: 'Sala já existe!' });
      }

      const sala = await Sala.create({
        name: nameDefault,
        type
      });

      return res.status(201).json({
        message: 'Sala criada com sucesso!',
        sala
      });

    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Sala já existe!" });
      }

      console.error('Erro ao criar sala:', err);
      return res.status(500).json({ message: 'Erro interno ao criar sala' });
    }
  }

  // Atualizar sala 🔷 (ESPAÇOS DE AULA) -> PUT
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      type: yup.string()
    })

    // Validação com yup
    try {
      schema.validateSync(req.body, {
        abortEarly: false,
        strict: true
      });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, type } = req.body
    const { id } = req.params

    if (id) {
      const espaco = await Sala.findByPk(id)
      if (!espaco) {
        return res.status(401).json({ message: "Sala não existe!!" })
      }
    }

    await Sala.update({
      name,
      type
    },
      {
        where: {
          id: id
        }
      });

    return res.status(200).json({
      message: "Atualizado!"
    });
  }

  // Deletar sala 🔷 -> DELETE
  async delete(req, res) {
    const { id } = req.params

    if (id) {
      const espaco = await Sala.findByPk(id)
      if (!espaco) {
        return res.status(401).json({ message: "Espaço de aula não existe!" })
      }
    }

    await Sala.destroy({
      where: { id: id }
    })

    return res.status(200).json({ message: "Deletado com sucesso!" })
  }

  // Listar salas 🔷 -> GET 
  async index(req, res) {
    try {
      const salas = await Sala.findAll({
        include: ['Turmas'], // traz todas as turmas associadas
      });
      return res.status(200).json(salas);
    } catch (err) {
      console.error('Erro ao buscar salas:', err);
      return res.status(500).json({ message: 'Erro interno ao buscar salas' });
    }
  }

  // Listar salas disponiveis 🔷 -> GET
  async disponiveis(req, res) {
    const { turno } = req.query;

    try {
      const where = {};

      if (turno) {
        where.turno = turno;
      }

      const turmas = await Turma.findAll({
        where,
        attributes: ["sala_id"]
      });

      const salasOcupadas = turmas
        .map(t => t.sala_id)
        .filter(id => id !== null);

      const salasDisponiveis = await Sala.findAll({
        where: {
          id: {
            [Op.notIn]: salasOcupadas.length ? salasOcupadas : [0]
          }
        }
      });

      return res.status(200).json(salasDisponiveis);

    } catch (err) {
      console.error("🔥 ERRO DISPONIVEIS:", err);

      return res.status(500).json({
        message: "Erro ao buscar salas disponíveis"
      });
    }
  }
}

export default new SalaController();