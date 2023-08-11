'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('role','status',{
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'status', key: 'id' }
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('role','status')
    ])
  }
};