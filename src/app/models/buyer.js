import Sequelize, { Model } from 'sequelize';
class Buyer extends Model {

	static init(sequelize) {
		super.init(
			{
        person: Sequelize.INTEGER,
        cpf_cnpj: Sequelize.STRING,
        is_cnpj: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'buyer',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Person, {foreignKey: 'person'})
    this.hasMany(models.Sale, {foreignKey: 'buyer'})
  }
}

export default Buyer;
