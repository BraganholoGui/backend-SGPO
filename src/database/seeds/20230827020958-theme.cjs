module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('user', 
    [
      {
        id: 1,
        name: 'Trabalho',
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('user', null, {}),
};


