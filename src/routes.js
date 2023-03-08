import {
    Router
} from 'express'
import authMiddleware from './app/middlewares/authMiddleware.js'
import ApiPing from './app/controllers/ApiPing.js'
import Session from './app/controllers/Session.js'
import Contact from './app/controllers/Contact.js'

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

export default routes;
