import bcrypt from 'bcryptjs';
import 'dotenv';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import database from '../../database/index.js';
import Person from '../models/person.js';
import User from '../models/user.js';
import content from './content.js';
import utils from './utils.js';
import {
    addDays
} from 'date-fns';
import {
    date
} from 'yup';
import { Op } from "sequelize";
import Role from '../models/role.js';
import Contact from '../models/contact.js';
import Team from '../models/team.js';
import TeamUser from '../models/teamUser.js';
import Task from '../models/task.js';

const sequelize = database.connection;

let include = [
    utils.include(Role, {}, false, null, null, null),
    utils.include(Team, {}, false, null, null, null),
    utils.include(TeamUser, {}, false, null, [
        utils.include(Team, {}, false, null, null, null),
    ], null),
    utils.include(Person, {}, false, null, [
        utils.include(Contact, {}, false, null, null, null),
    ], null)
];
class UserController {


    async index(req, res) {
        try {
            let access_name = req.query.accessName;
            let name = req.query.name;

            let where = {

            }
            // if (start && end) {
            //     dateWhere = {
            //         [Op.between]: [start, end]
            //     };
            // } else if (start && !end) {
            //     dateWhere = {
            //         [Op.gte]: start
            //     };
            // } else if (!start && end) {
            //     dateWhere = {
            //         [Op.lte]: end
            //     }
            // }
            if (access_name) {
                where.access_name = {
                    [Op.like]: `%${access_name}%`
                }
            }


            // let nameWhere = req.query.name;
            // if (nameWhere) {
            //     include.push(utils.include(Person, { }, true, null, [
            //         utils.include(Contact, { name: { [Op.like]:`%${nameWhere}%`} }, true, null, null, null),
            //     ], null))
            // } else{
            //     include.push(utils.include(Person, { }, false, null, [
            //         utils.include(Contact, { }, false, null, null, null),
            //     ], null))
            // }

            let teamWhere = req.query.team;
            if (teamWhere) {
                include.push(utils.include(TeamUser, { team: teamWhere }, true, null, [
                    utils.include(Team, { id: teamWhere }, true, null, null, null),
                ], null))
            } else {
                include.push(utils.include(TeamUser, {}, false, null, [
                    utils.include(Team, {}, false, null, null, null),
                ], null))
            }


            let roleWhere = req.query.role;
            if (roleWhere) {
                include.push(utils.include(Role, { id: roleWhere }, true, null))
            }

            const users = await User.findAll({
                order: ['id'],
                include,
                where
            });
            return res.json(
                content(users)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {
        try {

            const user = await User.findOne({
                where: {
                    id: req.params.id,
                },
                include
            });

            return res.status(200).json({
                user
            });
        } catch (e) {
            console.log(e)
        }
    }

    async store(req, res) {


        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            const userStored = await User.findOne({
                where: {
                    access_name: data.access_name,
                },
            });

            if (userStored) throw new Error("Nome de acesso já cadastrado!");


            if (data.password) {
                data.password = await bcrypt.hash(data.password, 8);
            } else {
                data.password = await bcrypt.hash('1234', 8);
            }

            let contact_stored;
            if (data.contact) {
                contact_stored = await Contact.create(data.contact, {
                    transaction
                });
            }

            let person_obj = {
                name: data.person.name,
                contact: contact_stored.id
            }

            let person_stored = await Person.create(person_obj, {
                transaction
            });

            let user_obj = {
                access_name: data.access_name,
                password_hash: data.password,
                person: person_stored.id,
                // team: data.team,
                role: data.role,
                photo: data.photo,

            }

            let user_stored = await User.create(user_obj, {
                transaction
            });

            await transaction.commit();
            return res.json(user_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: error.message || 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            const userStored = await User.findOne({
                where: {
                    access_name: data.access_name,
                },
            });
            if (userStored)
                if (user.access_name != userStored.access_name)
                    throw new Error("Nome de acesso já cadastrado!");

            let contact_updated = await Contact.update(data.contact, { where: { id: data.contact.id }, transaction })

            let person_obj = {
                name: data.person.name,
                contact: contact_updated.id
            }

            let person_updated = await Person.update(person_obj, { where: { id: data.person.id }, transaction })

            let user_obj = {
                access_name: data.access_name,
                person: person_updated.id,
                // team: data.team,
                role: data.role,
                photo: data.photo,
            }

            let user_updated = await User.update(user_obj, { where: { id: user.id }, transaction })

            await transaction.commit();

            return res.json(user_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: error.message || 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {
        try {
            include.push(utils.include(Task, { user: req.params.id }, false, null, null, null))
            const user = await User.findOne({
                where: {
                    id: req.params.id
                },
                include
            });

            if (!user)
                return res.status(400).json({
                    error: 'This User does not exists!'
                });

            if (user.TeamUsers.length > 0) {
                user.TeamUsers.map(item => {
                    item.destroy({ where: { id: item.id } });
                })
            }
            if (user.Tasks?.length > 0) {
                user.Tasks.map(item => {
                    // if (user.Tasks?.length > 0) {
                    //     user.Tasks.map(item => {
                    //         let obj = {
                    //             user: 2,
                    //         }
                    //         try{
                    //             item.update(obj, { where: { id: item.id } })
        
                    //         }catch(e){
                    //             console.log(e)
                    //         }
                    //     })
                    // }
                    item.destroy({ where: { id: item.id } });
                })
            }
            await user.destroy({ where: { id: req.params.id } });
            await user.Person.destroy({ where: { id: user.Person.id } });
            await user.Person.Contact.destroy({ where: { id: user.Person.Contact.id } });

            return res.status(200).json({
                message: 'User successfully deleted!'
            });

        } catch (e) {
            await transaction.rollback();
            return res.status(400).json({
                error: error.message || 'Erro ao atualizar registro'
            });
        }
    }

}

export default new UserController();
