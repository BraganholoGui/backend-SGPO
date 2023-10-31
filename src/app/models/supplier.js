import Sequelize, { Model } from 'sequelize';
class Supplier extends Model {

	static init(sequelize) {
		super.init(
			{
        person: Sequelize.INTEGER,
        cnpj: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'supplier',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Person, {foreignKey: 'person'})
    this.hasMany(models.SupplierPurchase, {foreignKey: 'supplier'})
  }
}

export default Supplier;
