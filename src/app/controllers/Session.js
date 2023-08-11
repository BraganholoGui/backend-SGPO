import jwt from 'jsonwebtoken';
// import User from '../models/user';

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

    // const user = await User.findOne({ where: { name } });

    let token = jwt.sign({ id: 'user.id' }, req.body.password, {
      expiresIn: 9000000,
    })

token = 123 
    if (!user) return res.status(401).json({ error: 'User not found' });

    // if (!(await user.checkPassword(password)))
    //   return res.status(401).json({ error: 'Password does not match' });

    // if (!user.active)
    //   return res.status(401).json({ error: 'User is not active' });

    // let data_last_acess = new Date();
    // let current_last_acess = new Date(data_last_acess.valueOf() - data_last_acess.getTimezoneOffset() * 60000);

    // await user.update({ updated_at: data_last_acess });

    // return res.json({
    //   user: {
    //     active: user.active,
    //     createdAt: user.createdAt,
    //     email: user.email,
    //     company: user.company,
    //     id: user.id,
    //     physical_person: user.physical_person,
    //     pf:user.pf,
    //     updatedAt: user.updatedAt
    //   },
    //   token: ..sign({ id: user.id }, authConfig.secret, {
    //     expiresIn: authConfig.expiresIn,
    //   }),
    // });
  }

  async decodeToken(token) {
    return { user: id, token: jwt.decode(token) }
  }
}

export default new SessionController();
