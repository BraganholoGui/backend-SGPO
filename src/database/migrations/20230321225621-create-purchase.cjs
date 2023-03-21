'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'id' },
      },
      material: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'material', key: 'id' },
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('purchase');
  }
};