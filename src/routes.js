import {
    Router
} from 'express'
import authMiddleware from './app/middlewares/authMiddleware.js'
import ApiPing from './app/controllers/ApiPing.js'
import Session from './app/controllers/Session.js'
import Address from './app/controllers/Address.js'

const routes = new Router()

routes.use(authMiddleware)
//Ping
routes.get("/ping", ApiPing.index)

// routes.post('/recuperacao/senha', User.reenviarSenha)
// routes.post('/updated/password', User.atualizarSenha)
//Address
routes.get('/addresses/:id', Address.getById)
routes.get('/addresses', Address.index)
routes.post('/addresses', Address.store)
routes.put('/addresses/:id', Address.update)

export default routes;
