import Sequelize, { Model } from 'sequelize';

class Contact extends Model {

	static init(sequelize) {
		super.init(
			{
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'contact',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.Person, {foreignKey: 'contact'})
  }
}

export default Contact;
