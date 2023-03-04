import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';
import Address from '../app/models/Address.js';

const models = [
  Address,
]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)

    models
     .map(model => model.init(this.connection))
     .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
