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
    this.hasMany(models.Purchase, {foreignKey: 'status'})
    this.hasMany(models.Sale, {foreignKey: 'status'})
  }
}

export default Status;
