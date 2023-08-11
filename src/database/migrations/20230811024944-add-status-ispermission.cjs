'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('status','id_permission',{
      type: Sequelize.BOOLEAN,
      allowNull: true,
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('status','id_permission')
    ])
  }
};