import Sequelize, { Model } from 'sequelize';

class Status extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        value: Sequelize.STRING,
        id_permission: Sequelize.BOOLEAN
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
    this.hasMany(models.Role, {foreignKey: 'status'})
  }
}

export default Status;
