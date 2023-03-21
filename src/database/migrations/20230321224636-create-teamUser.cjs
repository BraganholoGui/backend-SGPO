'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      team: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'team', key: 'id' },
      },
      user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('team_user');
  }
};