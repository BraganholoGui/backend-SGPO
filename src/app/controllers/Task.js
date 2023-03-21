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

const sequelize = database.connection;

let include = [
    utils.include(User, { id: true }, true, null, null, null),
    utils.include(Theme, { id: true }, true, null, null, null),
    utils.include(Priority, { id: true }, true, null, null, null),
    utils.include(Status, { id: true }, true, null, null, null),
];
class TaskController {


    async index(req, res) {
        try {
            // let start = req.query.start ? req.query.start.replace(/T[0-9][0-9]/i, "T00") : null;
            // let end = req.query.end ? req.query.end.replace(/T[0-9][0-9]/i, "T23") : null;
            // let dateWhere = null;

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

            // let where = {
            //     
            // }

            // if (dateWhere) {
            //     where[Op.or] = [{
            //         created_at: dateWhere
            //     }]
            // }

            // let unitWhere = req.query.unit;
            // if (unitWhere) {
            //     include.push(utils.include(Unit, { , id: unitWhere }, true, null))
            // } else {
            //     include.push(utils.include(Unit, {  }, false, null))
            // }

            const tasks = await Task.findAll({
                order: ['id'],
                // include 
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
            // include
        });

        return res.status(200).json({
            task,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

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
            let data = req.body
          
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
    }

}

export default new TaskController();
