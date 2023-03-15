import {
    Router
} from 'express'
import authMiddleware from './app/middlewares/authMiddleware.js'
import ApiPing from './app/controllers/ApiPing.js'
import Session from './app/controllers/Session.js'
import Contact from './app/controllers/Contact.js'
import Role from './app/controllers/Role.js'
import Person from './app/controllers/Person.js'

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

export default routes;
