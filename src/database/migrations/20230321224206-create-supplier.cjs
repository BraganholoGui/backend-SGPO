'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supplier', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      person: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'person', key: 'id' },
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('supplier');
  }
};