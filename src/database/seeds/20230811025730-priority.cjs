module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('priority', 
    [
      {
        id: 1,
        name: 'Baixa',
        value: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Média',
        value: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Alta',
        value: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'Urgente',
        value: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('priority', null, {}),
};