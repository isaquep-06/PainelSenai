import { Model, DataTypes } from "sequelize";

class SystemUpdateLog extends Model {
  static init(sequelize) {
    return super.init(
      {
        entity_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entity_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        action: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        turno: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        turnos: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        performed_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        performed_by_username: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        occurred_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "system_update_logs",
        updatedAt: false,
        createdAt: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "performed_by",
      as: "User",
    });
  }
}

export default SystemUpdateLog;
