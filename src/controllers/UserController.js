import yup from 'yup';
import models from "../models/index.js";
import bcrypt from 'bcryptjs';

const { User, Sala, Turma } = models;

class UserController {
    async store(req, res) {
        const schema = yup.object().shape({
            username: yup
                .string()
                .required('O nome de usuário é obrigatório'),

            password: yup
                .string()
                .min(6, 'A senha deve conter no mínimo 6 caracteres')
                .required('A senha é obrigatória'),
        })

        try {
            schema.validateSync(req.body, {
                abortEarly: false,
                strict: true
            });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { username, password } = req.body;

        const password_hash = await bcrypt.hash(password, 8);

        const existingUser = await User.findOne({
            where: { username }
        })

        if (existingUser) {
            return res.status(400).json({
                error: 'O nome de usuário já está em uso'
            })
        }

        try {
            const user = await User.create({
                username,
                password: password_hash
            });

            return res.status(201).json({
                message: 'Usuário criado com sucesso!',
                user: {
                    id: user.id,
                    username: user.username
                }
            });

        } catch (err) {
            return res.status(400).json({ err });
        }
    }

}

export default new UserController();