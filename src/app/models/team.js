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
    this.hasMany(models.User, {foreignKey: 'team'})
    this.hasMany(models.TeamUser, {foreignKey: 'team'})
  }
}

export default Team;
