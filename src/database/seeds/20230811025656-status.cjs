module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('status', 
    [
      {
        id: 1,
        name: 'Pendente',
        value: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Andamento',
        value: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Finalizado',
        value: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'Admin',
        value: 4,
        id_permission: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: 'Financeiro',
        value: 5,
        id_permission: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: 'Comum',
        value: 6,
        id_permission: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('status', null, {}),
};