import Sequelize, { Model } from 'sequelize';
class User extends Model {

	static init(sequelize) {
		super.init(
			{
        access_name: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        person: Sequelize.INTEGER,
        role: Sequelize.INTEGER,
        team: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'user',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Person, {foreignKey: 'person'}),
    this.belongsTo(models.Role, {foreignKey: 'role'}),
    this.belongsTo(models.Team, {foreignKey: 'team'}),
    this.hasMany(models.TeamUser, {foreignKey: 'user'})

  }
}

export default User;
