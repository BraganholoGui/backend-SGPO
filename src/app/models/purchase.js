import Sequelize, { Model } from 'sequelize';
class Purchase extends Model {

	static init(sequelize) {
		super.init(
			{
        product: Sequelize.INTEGER,
        material: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
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
    this.belongsTo(models.Product, {foreignKey: 'product'})
    this.belongsTo(models.Material, {foreignKey: 'material'})
    this.belongsTo(models.Material, {foreignKey: 'status'})
    this.hasMany(models.SupplierPurchase, {foreignKey: 'purchase'})
  }
}

export default Purchase;
