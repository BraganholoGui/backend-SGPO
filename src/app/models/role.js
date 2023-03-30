import Sequelize, { Model } from 'sequelize';

class Role extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
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
    this.hasMany(models.User, {foreignKey: 'team'})
  }
}

export default Role;
