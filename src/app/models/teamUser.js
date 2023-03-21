import Sequelize, { Model } from 'sequelize';
class TeamUser extends Model {

	static init(sequelize) {
		super.init(
			{
        team: Sequelize.INTEGER,
        user: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'team_user',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Team, {foreignKey: 'team'}),
    this.belongsTo(models.User, {foreignKey: 'user'})
  }
}

export default TeamUser;
