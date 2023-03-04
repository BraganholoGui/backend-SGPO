import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';
// import User from '../models/User.js';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if (req.originalUrl.indexOf("/sessions") >= 0){
  //    return next();
  // }

  // if (!authHeader && !req.query.token) return res.status(401).json({ error: 'Token not provided' });

  // let token_splited = null;
  // if(authHeader){
  //  const [, token] = authHeader.split(' ');
  //  token_splited = token;
  // }
  // token_splited = token_splited || req.query.token;

  // try {
  //  const decoded = await promisify(jwt.verify)(token_splited, authConfig.secret);
  //  req.userId = decoded.id;
  // } catch (error) {
  //  return res.status(401).json({ error: 'Token invalid' });
  // }

  // try {
  //  let userfound = await User.findOne({ where: { id: req.userId } })
  //  if(!userfound.active){
  //    return res.status(401).json({ error: 'User is not active' });
  //  }
  // } catch (error) {
  //  return res.status(401).json({ error: 'User is not active' });
  // }

  return next();
};
