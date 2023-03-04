import Sequelize, { Model } from 'sequelize';

class Address extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        number: Sequelize.INTEGER,
        district: Sequelize.STRING,
        complement: Sequelize.STRING,
        cep: Sequelize.INTEGER,
        uf: Sequelize.STRING,
        city: Sequelize.STRING,
        active: Sequelize.INTEGER
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'address',
      }
    );
    return this;
  }
}

export default Address;
