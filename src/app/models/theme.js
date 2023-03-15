import Sequelize, { Model } from 'sequelize';

class Theme extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'theme',
      }
    );
    return this;
  }
}

export default Theme;
