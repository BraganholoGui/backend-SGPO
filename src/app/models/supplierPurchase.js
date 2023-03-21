import Sequelize, { Model } from 'sequelize';
class SupplierPurchase extends Model {

	static init(sequelize) {
		super.init(
			{
        supplier: Sequelize.INTEGER,
        purchase: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'supplier_purchase',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Supplier, {foreignKey: 'supplier'}),
    this.belongsTo(models.Purchase, {foreignKey: 'purchase'})
  }
}

export default SupplierPurchase;
