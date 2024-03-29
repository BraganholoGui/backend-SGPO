import Sequelize, { Model } from 'sequelize';
class Task extends Model {

	static init(sequelize) {
		super.init(
			{
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        theme: Sequelize.INTEGER,
        start: Sequelize.DATE,
        end: Sequelize.DATE,
        user: Sequelize.INTEGER,
        created_by: Sequelize.INTEGER,
        status: Sequelize.INTEGER,
        priority: Sequelize.INTEGER,
        
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'task',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Theme, {foreignKey: 'theme'}),
    this.belongsTo(models.User, {foreignKey: 'user'}),
    this.belongsTo(models.User, {as: 'createdBy', foreignKey: 'created_by'}),
    this.belongsTo(models.Status, {foreignKey: 'status'}),
    this.belongsTo(models.Priority, {foreignKey: 'priority'})
  }
}

export default Task;
