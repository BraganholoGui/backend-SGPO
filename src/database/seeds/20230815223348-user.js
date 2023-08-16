module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('contact', 
    [
      {
        id: 1,
        access_name: 'admin',
        password_hash: '1234',
        person: 1,
        role: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('contact', null, {}),
};


