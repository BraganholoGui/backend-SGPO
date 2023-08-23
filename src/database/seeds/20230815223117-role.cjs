module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('role', 
    [
      {
        id: 1,
        name: 'admin',
        status: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('role', null, {}),
};