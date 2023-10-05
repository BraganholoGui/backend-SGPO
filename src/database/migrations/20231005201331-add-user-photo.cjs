'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('user','photo',{
      type: Sequelize.TEXT('long'),
      allowNull: true,
      after:'person'
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('user','photo')
    ])
  }
};