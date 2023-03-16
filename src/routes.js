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

const routes = new Router()

routes.use(authMiddleware)
//Ping
routes.get("/ping", ApiPing.index)

// routes.post('/recuperacao/senha', User.reenviarSenha)
// routes.post('/updated/password', User.atualizarSenha)

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

// Priority
routes.post('/priorities', Priority.store)
routes.put('/priorities/:id', Priority.update)
routes.get('/priorities', Priority.index)
routes.get('/priorities/:id', Priority.getById)
routes.delete('/priorities/:id', Priority.delete)

// Team
routes.post('/teams', Team.store)
routes.put('/teams/:id', Team.update)
routes.get('/teams', Team.index)
routes.get('/teams/:id', Team.getById)
routes.delete('/teams/:id', Team.delete)

// Status
routes.post('/status', Status.store)
routes.put('/status/:id', Status.update)
routes.get('/status', Status.index)
routes.get('/status/:id', Status.getById)
routes.delete('/status/:id', Status.delete)

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
