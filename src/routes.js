import {
    Router
} from 'express'
import authMiddleware from './app/middlewares/authMiddleware.js'
import ApiPing from './app/controllers/ApiPing.js'
import Session from './app/controllers/Session.js'
import Contact from './app/controllers/Contact.js'
import Role from './app/controllers/Role.js'
import Person from './app/controllers/Person.js'
import Team from './app/controllers/Team.js'
import User from './app/controllers/User.js'
import Theme from './app/controllers/Theme.js'
import Priority from './app/controllers/Priority.js'
import Status from './app/controllers/Status.js'
import Goal from './app/controllers/Goal.js'
import Task from './app/controllers/Task.js'
import Product from './app/controllers/Product.js'
import Material from './app/controllers/Material.js'
import Buyer from './app/controllers/Buyer.js'
import Stock from './app/controllers/Stock.js'
import Supplier from './app/controllers/Supplier.js'
import Purchase from './app/controllers/Purchase.js'
import Sale from './app/controllers/Sale.js'

const routes = new Router()

routes.use(authMiddleware)
//Ping
routes.get("/ping", ApiPing.index)

//Buyer
routes.get('/buyers/:id', Buyer.getById)
routes.get('/buyers', Buyer.index)
routes.post('/buyers', Buyer.store)
routes.put('/buyers/:id', Buyer.update)
routes.delete('/buyers/:id', Buyer.delete)

//Contact
routes.get('/contacts/:id', Contact.getById)
routes.get('/contacts', Contact.index)
routes.post('/contacts', Contact.store)
routes.put('/contacts/:id', Contact.update)
routes.delete('/contacts/:id', Contact.delete)

//Goal
routes.get('/goals/:id', Goal.getById)
routes.get('/goals', Goal.index)
routes.post('/goals', Goal.store)
routes.put('/goals/:id', Goal.update)
routes.delete('/goals/:id', Goal.delete)

//Material
routes.get('/materials/:id', Material.getById)
routes.get('/materials', Material.index)
routes.post('/materials', Material.store)
routes.put('/materials/:id', Material.update)
routes.delete('/materials/:id', Material.delete)

// Role
routes.post('/roles', Role.store)
routes.put('/roles/:id', Role.update)
routes.get('/roles', Role.index)
routes.get('/roles/:id', Role.getById)
routes.delete('/roles/:id', Role.delete)

// People
routes.post('/people', Person.store)
routes.put('/people/:id', Person.update)
routes.get('/people', Person.index)
routes.get('/people/:id', Person.getById)
routes.delete('/people/:id', Person.delete)

// Product
routes.post('/products', Product.store)
routes.put('/products/:id', Product.update)
routes.get('/products', Product.index)
routes.get('/products/:id', Product.getById)
routes.delete('/products/:id', Product.delete)

// Priority
routes.post('/priorities', Priority.store)
routes.put('/priorities/:id', Priority.update)
routes.get('/priorities', Priority.index)
routes.get('/priorities/:id', Priority.getById)
routes.delete('/priorities/:id', Priority.delete)

// Purchase
routes.post('/purchases', Purchase.store)
routes.put('/purchases/:id', Purchase.update)
routes.get('/purchases', Purchase.index)
routes.get('/purchases/:id', Purchase.getById)
routes.delete('/purchases/:id', Purchase.delete)

// Task
routes.post('/tasks', Task.store)
routes.put('/tasks/:id', Task.update)
routes.get('/tasks', Task.index)
routes.get('/tasks/:id', Task.getById)
routes.delete('/tasks/:id', Task.delete)

// Team
routes.post('/teams', Team.store)
routes.put('/teams/:id', Team.update)
routes.get('/teams', Team.index)
routes.get('/teams/:id', Team.getById)
routes.delete('/teams/:id', Team.delete)

// Sale
routes.post('/sales', Sale.store)
routes.put('/sales/:id', Sale.update)
routes.get('/sales', Sale.index)
routes.get('/sales/:id', Salee.getById)
routes.delete('/sales/:id', Sale.delete)

// Status
routes.post('/status', Status.store)
routes.put('/status/:id', Status.update)
routes.get('/status', Status.index)
routes.get('/status/:id', Status.getById)
routes.delete('/status/:id', Status.delete)

// Stock
routes.post('/stoks', Stock.store)
routes.put('/stoks/:id', Stock.update)
routes.get('/stoks', Stock.index)
routes.get('/stoks/:id', Stock.getById)
routes.delete('/stoks/:id', Stock.delete)

// Supplier
routes.post('/suppliers', Supplier.store)
routes.put('/suppliers/:id', Supplier.update)
routes.get('/suppliers', Supplier.index)
routes.get('/suppliers/:id', Supplier.getById)
routes.delete('/suppliers/:id', Supplier.delete)

// Theme
routes.post('/themes', Theme.store)
routes.put('/themes/:id', Theme.update)
routes.get('/themes', Theme.index)
routes.get('/themes/:id', Theme.getById)
routes.delete('/themes/:id', Theme.delete)

// User
routes.post('/users', User.store)
routes.put('/users/:id', User.update)
routes.get('/users', User.index)
routes.get('/users/:id', User.getById)
routes.delete('/users/:id', User.delete)

export default routes;
