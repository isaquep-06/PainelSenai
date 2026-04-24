import { Sequelize } from "sequelize";

const connectionString = 'postgresql://neondb_owner:npg_rinbQdyPv8z5@ep-fragrant-sun-acpjeupu-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('ConexÃ£o com Neon OK!')
  } catch (err) {
    console.error('Erro de conexÃ£o:', err);
  }
})();

export default sequelize;
