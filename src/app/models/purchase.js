import Sequelize, { Model } from 'sequelize';
class Purchase extends Model {

	static init(sequelize) {
		super.init(
			{
        product: Sequelize.INTEGER,
        meterial: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'purchase',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {foreignKey: 'product'}),
    this.belongsTo(models.Material, {foreignKey: 'material'})
  }
}

export default Purchase;
