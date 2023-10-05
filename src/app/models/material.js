import Sequelize, { Model } from 'sequelize';

class Material extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        description: Sequelize.TEXT,
        quantity_min: Sequelize.INTEGER,
        quantity: Sequelize.INTEGER,
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
