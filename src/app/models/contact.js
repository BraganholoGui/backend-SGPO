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
        tableName: 'Contacts',
      }
    );
    return this;
  }
}

export default Contact;
