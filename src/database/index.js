import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL nao definida.");
}

const connectionUrl = new URL(databaseUrl);
connectionUrl.searchParams.delete("sslmode");
connectionUrl.searchParams.delete("channel_binding");

const connectionString = connectionUrl.toString();

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    keepAlive: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexao com Neon OK!");
  } catch (err) {
    console.error("Erro de conexao com Neon:", err);
  }
})();

export default sequelize;
