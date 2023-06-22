'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('material','quantity',{
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'description'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('material','quantity')
    ])
  }
};
