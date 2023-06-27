'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('purchase','status',{
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'status', key: 'id' }
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('purchase','status')
    ])
  }
};
