import Sequelize, { Model } from 'sequelize';

class Product extends Model {

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
        tableName: 'product',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Stock, {foreignKey: 'product'})
  }
}

export default Product;
