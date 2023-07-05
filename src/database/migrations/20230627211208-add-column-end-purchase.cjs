'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.addColumn('purchase','end',{
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
     })
   ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('purchase','end')
    ])
  }
};
