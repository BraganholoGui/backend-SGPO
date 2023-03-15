'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      access_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      person: {
        type: Sequelize.INTEGER,
        references: { model: 'person', key: 'id' },
        allowNull: false
      },
      role: {
        type: Sequelize.INTEGER,
        references: { model: 'role', key: 'id' },
        allowNull: true
      },
      team: {
        type: Sequelize.INTEGER,
        references: { model: 'team', key: 'id' },
        allowNull: true
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
    await queryInterface.dropTable('user');
  }
};