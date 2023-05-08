'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('product','quantity_min',{
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'description'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('product','quantity_min')
    ])
  }
};
