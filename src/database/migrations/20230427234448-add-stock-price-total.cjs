'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('stock','total_price',{
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'quantity'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('stock','total_price')
    ])
  }
};
