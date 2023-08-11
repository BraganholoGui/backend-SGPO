'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('user','token',{
      type: Sequelize.STRING,
      allowNull: true,
      after:'person'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('user','token')
    ])
  }
};