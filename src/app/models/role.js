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
}

export default Role;
