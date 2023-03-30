import Sequelize, { Model } from 'sequelize';
class Team extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'team',
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, {foreignKey: 'person'})
  }
}

export default Team;
