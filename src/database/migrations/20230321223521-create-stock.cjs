'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'product', key: 'id' },
      },
      material: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'material', key: 'id' },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_price: {
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable('stock');
  }
};