module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('theme', 
    [
      {
        id: 1,
        name: 'Trabalho',
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('theme', null, {}),
};


