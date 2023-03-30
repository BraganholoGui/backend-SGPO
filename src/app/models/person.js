import Sequelize, { Model } from 'sequelize';
class Person extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        contact: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'person',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, {foreignKey: 'person'}),
    this.belongsTo(models.Contact, {foreignKey: 'contact'})
  }
}

export default Person;
