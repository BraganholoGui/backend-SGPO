import Sequelize, { Model } from 'sequelize';

class Role extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        status: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'role',
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Status, {foreignKey: 'status'})
    this.hasMany(models.User, {foreignKey: 'role'})
  }
}

export default Role;
