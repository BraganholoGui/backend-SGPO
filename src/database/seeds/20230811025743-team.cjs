module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('team', 
    [
      {
        id: 1,
        name: 'Financeiro',
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('team', null, {}),
};