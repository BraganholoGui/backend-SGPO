import bcrypt from 'bcryptjs';
import 'dotenv';
import database from '../../database/index.js';
import Person from '../models/person.js';
import Task from '../models/task.js';
import content from './content.js';
import utils from './utils.js';

import Role from '../models/role.js';
import Contact from '../models/contact.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Theme from '../models/theme.js';
import Priority from '../models/priority.js';
import Status from '../models/status.js';
import { Op } from 'sequelize';

const sequelize = database.connection;

let include = [
    utils.include(User, {}, false, null, [
        utils.include(Person, {}, false, null, [
            utils.include(Contact, {}, false, null, null, null),
        ], null),
    ], null),
    utils.include(Theme, {}, false, null, null, null),
    utils.include(Priority, {}, false, null, null, null),
    utils.include(Status, {}, false, null, null, null),
    utils.include(User, {}, false, null, [
        utils.include(Person, {}, false, null, [
            utils.include(Contact, {}, false, null, null, null),
        ], null),
    ], 'createdBy'),
];
class TaskController {
    async index(req, res) {
        try {
            let descriptionWhere = req.query.description;;
            let userWhere = req.query.user;;
            let themeWhere = req.query.theme;;
            let priorityWhere = req.query.priority;;

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

            let where = {

            }

            if (descriptionWhere) {
                where.name = {
                    [Op.like]: `%${descriptionWhere}%`
                }
            };
            if (userWhere) {
                where.user = userWhere;
            }
            if (themeWhere) {
                where.theme = themeWhere;
            }
            if (priorityWhere) {
                where.priority = priorityWhere;
            }


            const tasks = await Task.findAll({
                order: ['id'],
                where,
                include
            });
            return res.json(
                content(tasks)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const task = await Task.findOne({
            where: {
                id: req.params.id,

            },
            include
        });

        return res.status(200).json({
            task,
        });
    }
    async getByUserId(req, res) {

        const task = await Task.findAll({
            where: {
                user: req.params.id,

            },
            include
        });

        return res.json(
            content(task)
        );
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body
            if (data.end){
                data.end = new Date(data.end)                
                data.end.setHours(data.end.getHours() + 4);
            }

            let task = await Task.create(data, {
                transaction
            });

            await transaction.commit();
            return res.json(task);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: 'Task not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body;

            if (data.end){
                data.end = new Date(data.end)                
                data.end.setHours(data.end.getHours() + 4);
            }

            let task_updated = await Task.update(data, { where: { id: task.id }, transaction })

            await transaction.commit();

            return res.json(task_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {
        try{
            const task = await Task.findOne({
                where: {
                    id: req.params.id
                }
            });
    
            if (!task)
                return res.status(400).json({
                    error: 'This Task does not exists!'
                });
    
            await task.destroy();
            return res.status(200).json({
                message: 'Task successfully deleted!'
            });

        }catch(e){
            console.info(e)
        }
    }

}

export default new TaskController();
