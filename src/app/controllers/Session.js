import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { callbackPromise } from 'nodemailer/lib/shared/index.js';

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
class SessionController {

  async login(req, res) {
    if (!req.body || !req.body.name || !req.body.password)
      return res.status(400).json({ error: 'Validation session fails' });

    const { name, password } = req.body;

    const user = await User.findOne({ where: { access_name: name } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
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

  async decodeToken(token) {
    return { user: id, token: jwt.decode(token) }
  }
}

export default new SessionController();
