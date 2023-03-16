import Sequelize, { Model } from 'sequelize';
class Goal extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        team: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'goal',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Team, {foreignKey: 'team'})
  }
}

export default Goal;
