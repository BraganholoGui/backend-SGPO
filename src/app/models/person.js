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
        tableName: 'Person',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Contact, {foreignKey: 'contact'}),
    this.belongsTo(models.User, {foreignKey: 'person'})
  }
}

export default Person;
