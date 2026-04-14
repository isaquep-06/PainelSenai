import { Model, DataTypes } from "sequelize";

class User extends Model {
    static init(sequelize) {
        return super.init({
            username: DataTypes.STRING,
            password: DataTypes.STRING,
        },
            {
                sequelize,
                tableName: 'users',
            }
        );
    }
}

export default User;  