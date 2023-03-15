import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';
import Role from '../app/models/role.js';
import Contact from '../app/models/contact.js';
import Person from '../app/models/team.js';
import Team from '../app/models/team.js';

const models = [
  Contact,
  Role,
  Team,
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
    models
    .map(model => console.log(model))
    }
}

export default new Database()
