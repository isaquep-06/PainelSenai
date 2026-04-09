import yup from 'yup';
import models from '../models/index.js';

const { Sala} = models;

class SalaController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required('Nome da sala é obrigatório'),
      type: yup.string().required('Tipo da sala é obrigatório'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ message: err.errors });
    }

    try {
      const sala = await Sala.create(req.body);
      return res.status(201).json({ message: 'Sala criada com sucesso!', sala });
    } catch (err) {
      console.error('Erro ao criar sala:', err);
      return res.status(500).json({ message: 'Erro interno ao criar sala' });
    }
  }

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
}

export default new SalaController();