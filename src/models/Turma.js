import { Model, DataTypes } from 'sequelize';

class Turma extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        turno: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sala_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'salas',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      {
        sequelize,
        tableName: 'turmas',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Sala, { foreignKey: 'sala_id', as: 'Sala' });
  }
}

export default Turma;