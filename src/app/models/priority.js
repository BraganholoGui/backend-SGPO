import Sequelize, { Model } from 'sequelize';

class Priority extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        value: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'priority',
      }
    );
    return this;
  }
}

export default Priority;
