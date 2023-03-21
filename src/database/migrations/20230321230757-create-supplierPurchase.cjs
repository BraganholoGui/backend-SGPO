'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supplier_purchase', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      supplier: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'supplier', key: 'id' },
      },
      purchase: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'purchase', key: 'id' },
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
    await queryInterface.dropTable('supplier_purchase');
  }
};