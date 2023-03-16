'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      team: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'team', key: 'id' },
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
    await queryInterface.dropTable('goal');
  }
};