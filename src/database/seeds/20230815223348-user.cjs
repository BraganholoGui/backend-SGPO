module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('user', 
    [
      {
        id: 1,
        access_name: 'admin',
        password_hash: '$2a$08$vvJw3DontL1MMm0xjGytfe5GhebmiXnPkFH6bOGjg0HV8f8zr/cW6',
        person: 1,
        role: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('user', null, {}),
};


