import 'dotenv';
import database from '../../database/index.js';
import Person from '../models/person.js';
import TeamUser from '../models/teamUser.js';
import content from './content.js';
import Contact from '../models/contact.js';

const sequelize = database.connection;

class TeamUserController {
    async index(req, res) {
        try {
            const team_users = await TeamUser.findAll({
                order: ['id'],
            });
            return res.json(
                content(team_users)
            );
        } catch (e) {
            console.error(e)
        }

    }
    async getById(req, res) {

        const team_user = await TeamUser.findOne({
            where: {
                id: req.params.id,
            },
            include
        });

        return res.status(200).json({
            team_user,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let team_user_stored = await TeamUser.create(data, {
                transaction
            });

            await transaction.commit();
            return res.json(team_user_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async update(req, res) {

        const team_user = await TeamUser.findByPk(req.params.id);

        if (!team_user) {
            return res.status(404).json({
                error: 'TeamUser not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            let team_user_updated = await TeamUser.update(data, { where: { id: team_user.id }, transaction })

            await transaction.commit();

            // await sendEmail(data.email, user_updated.id, res);

            return res.json(team_user_updated);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao atualizar registro'
            });
        }
    }

    async delete(req, res) {

        const team_user = await TeamUser.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!team_user)
            return res.status(400).json({
                error: 'This TeamUser does not exists!'
            });

        await team_user.destroy();
        return res.status(200).json({
            message: 'TeamUser successfully deleted!'
        });
    }

}

export default new TeamUserController();
