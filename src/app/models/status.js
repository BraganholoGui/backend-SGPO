import Sequelize, { Model } from 'sequelize';

class Status extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        value: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'status',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.SupplierPurchase, {foreignKey: 'purchase'})
  }
}

export default Status;
