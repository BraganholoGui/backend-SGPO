import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';
import Role from '../app/models/role.js';
import Contact from '../app/models/contact.js';
import Person from '../app/models/person.js';
import Team from '../app/models/team.js';
import User from '../app/models/user.js';
import Priority from '../app/models/priority.js';
import Theme from '../app/models/theme.js';
import Status from '../app/models/status.js';
import Goal from '../app/models/goal.js';
import Task from '../app/models/task.js';
import Product from '../app/models/product.js';
import Material from '../app/models/material.js';
import Buyer from '../app/models/buyer.js';
import Stock from '../app/models/stock.js';
import Supplier from '../app/models/supplier.js';

const models = [
  Buyer,
  Contact,
  Goal,
  Material,
  Person,
  Priority,
  Product,
  Role,
  Status,
  Stock,
  Supplier,
  Team,
  Theme,
  Task,
  User,
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
