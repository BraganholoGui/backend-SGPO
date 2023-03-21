import Sequelize, { Model } from 'sequelize';

class Material extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        description: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'material',
      }
    );
    return this;
  }
}

export default Material;
