import Sequelize, { Model } from 'sequelize';
class Sale extends Model {

	static init(sequelize) {
		super.init(
			{
        buyer: Sequelize.INTEGER,
        product: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'sale',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {foreignKey: 'product'}),
    this.belongsTo(models.Buyer, {foreignKey: 'buyer'})
  }
}

export default Sale;
