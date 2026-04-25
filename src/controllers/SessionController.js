import Yup from "yup";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth.cjs";

const { User } = models;

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().min(3).required(),
    });

    const isValidUser = await schema.isValid(req.body);

    const EmailOrPasswordIncorrect = () => {
      return res.status(400).json({
        error: "Usuário ou senha incorretos!",
      });
    };

    if (!isValidUser) {
      return EmailOrPasswordIncorrect();
    }

    const { username, password } = req.body;

    const existingUser = await User.findOne({
      where: { username },
    });

    if (!existingUser) {
      return EmailOrPasswordIncorrect();
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return EmailOrPasswordIncorrect();
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );

    return res.json({
      user: {
        id: existingUser.id,
        username: existingUser.username
      },
      token
    });
  }
}

export default new SessionController();
