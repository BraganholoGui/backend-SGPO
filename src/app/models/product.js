import Sequelize, { Model } from 'sequelize';

class Product extends Model {

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
        tableName: 'product',
      }
    );
    return this;
  }
}

export default Product;
