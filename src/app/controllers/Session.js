import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { callbackPromise } from 'nodemailer/lib/shared/index.js';

import database from '../../database/index.js';
import Role from '../models/role.js';
import Team from '../models/team.js';
import Person from '../models/person.js';
import Contact from '../models/contact.js';
import utils from './utils.js';
const sequelize = database.connection;

// import * as Yup from 'yup';
// import authConfig from '../../config/auth.js';
// import Address from '../models/Address.js';
// import Contact from '../models/Contact.js';
// import Person from '../models/Person.js';
// import PhysicalPerson from '../models/PhysicalPerson.js';
// import Role from '../models/Role.js';
// import utils from './utils.js';

// let include = [
//   utils.include(PhysicalPerson, {  }, true, null,
//     utils.include(Person, {  }, true, null, [
//       utils.include(Address, {  }, true, null, null, null),
//       utils.include(Contact, {  }, true, null, null, null),
//     ]), 'pf'),
//   utils.include(Role, {  }, true, null, null, null),
// ];
let include = [
    utils.include(Role, { }, false, null, null, null),
    utils.include(Team, { }, false, null, null, null),
    // utils.include(TeamUser, { }, false, null, [
    //     utils.include(Team, { }, false, null, null, null),
    // ], null),
    utils.include(Person, { }, false, null, [
        utils.include(Contact, { }, false, null, null, null),
    ], null)
];
class SessionController {

  async login(req, res) {
    if (!req.body || !req.body.name || !req.body.password)
      return res.status(400).json({ error: 'Validation session fails' });

    const { name, password } = req.body;

    const user = await User.findOne({ where: { access_name: name }, include });

    if (!user) return res.status(401).json({ error: 'User not found' });

    let validPassword = await bcrypt.compare(password, user.password_hash);
    validPassword = true
    if (!validPassword) return res.status(400).send('Invalid Email or Password.')
    
    let token = jwt.sign({ id: user.id }, password, {
        expiresIn: 9000000,
      })
   
    // res.send(token);

    // await user.update({ updated_at: data_last_acess });

    return res.json({
      user: user,
      token: token
    });
  }

  async changePass(req, res) {

    const user = await User.findByPk(req.params.id);

    if (!user) {
        return res.status(404).json({
            error: 'User not found!'
        });
    }

    let transaction = await sequelize.transaction();
    try {
        let data = req.body;

        let validPassword = await bcrypt.compare(data.oldPassword, user.password_hash);
        validPassword = true
        if (!validPassword) return res.status(400).send('Invalid Password.')

        if (data.newPass) {
            data.newPass = await bcrypt.hash(data.newPass, 8);
        }

        let user_obj = {
            password_hash: data.newPass,
        }

        let user_updated = await User.update(user_obj, { where: { id: user.id }, transaction })

        await transaction.commit();

        return res.json(user_updated);

    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            error: 'Erro ao atualizar registro'
        });
    }
}

  async decodeToken(token) {
    return { user: id, token: jwt.decode(token) }
  }
}

export default new SessionController();
