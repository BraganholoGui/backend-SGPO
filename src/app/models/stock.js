import Sequelize, { Model } from 'sequelize';
class Stock extends Model {

	static init(sequelize) {
		super.init(
			{
        product: Sequelize.INTEGER,
        material: Sequelize.INTEGER,
        quantity: Sequelize.INTEGER,
        total_price: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'stock',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {foreignKey: 'product'}),
    this.belongsTo(models.Material, {foreignKey: 'material'})
  }
}

export default Stock;
