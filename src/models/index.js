import Sequelize from 'sequelize';
import DatabaseConfig from '../database/index.js';
import Sala from './Sala.js';
import Turma from './Turma.js';
import User from './User.js';
import SystemUpdateLog from './SystemUpdateLog.js';

const sequelize = DatabaseConfig;

const models = {
  Sala: Sala.init(sequelize),
  Turma: Turma.init(sequelize),
  User: User.init(sequelize),
  SystemUpdateLog: SystemUpdateLog.init(sequelize),
};

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export default { ...models, sequelize };
