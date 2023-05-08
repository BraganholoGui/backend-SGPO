import Sequelize, { Model } from 'sequelize';

class Material extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        description: Sequelize.STRING,
        quantity_min: Sequelize.INTEGER,
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
